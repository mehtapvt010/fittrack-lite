package com.fittracklite.batchjob.service;

import com.fittracklite.batchjob.model.User;
import com.fittracklite.batchjob.model.Workout;
import com.fittracklite.batchjob.model.Meal;
import com.fittracklite.batchjob.repository.UserRepository;
import com.fittracklite.batchjob.repository.WorkoutRepository;
import com.fittracklite.batchjob.repository.MealRepository;
import com.opencsv.CSVWriter;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.FileWriter;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
public class SummaryService {
    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;
    private final MealRepository mealRepository;

    public SummaryService(UserRepository userRepository, WorkoutRepository workoutRepository, MealRepository mealRepository) {
        this.userRepository = userRepository;
        this.workoutRepository = workoutRepository;
        this.mealRepository = mealRepository;
    }

    public void generateWeeklySummary() throws Exception {
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(7);

        Date startDate = Date.from(weekAgo.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(today.atStartOfDay(ZoneId.systemDefault()).toInstant());

        List<User> users = userRepository.findAll();

        // Ensure outputs directory exists
        File outputDir = new File("outputs");
        if (!outputDir.exists()) {
            outputDir.mkdirs();
        }

        String localFilePath = "outputs/weekly_summary.csv";

        try (CSVWriter writer = new CSVWriter(new FileWriter(localFilePath))) {
            String[] header = {"UserId", "Email", "TotalCalories", "CaloriesGoal", "TotalVolume", "VolumeGoal"};
            writer.writeNext(header);

            for (User user : users) {
                List<Meal> meals = mealRepository.findByUserIdAndCreatedAtBetween(user.getId(), startDate, endDate);
                List<Workout> workouts = workoutRepository.findByUserIdAndDateBetween(user.getId(), startDate, endDate);

                int totalCalories = meals.stream().mapToInt(Meal::getCalories).sum();
                int totalVolume = workouts.size() * 100; // TODO: Replace hardcoded 100 with actual workout volume calculation

                String[] row = {
                        user.getId(),
                        user.getEmail(),
                        String.valueOf(totalCalories),
                        user.getWeeklyCalorieGoal() != null ? user.getWeeklyCalorieGoal().toString() : "0",
                        String.valueOf(totalVolume),
                        user.getWeeklyGoal() != null ? user.getWeeklyGoal().toString() : "0"
                };
                writer.writeNext(row);
            }
        }

        System.out.println("✅ Weekly summary CSV generated at: " + localFilePath);

        // Upload the CSV to S3
        uploadCsvToS3(localFilePath);
    }

    private void uploadCsvToS3(String filePath) {
        String bucketName = System.getenv("S3_BUCKET_NAME");
        if (bucketName == null || bucketName.isEmpty()) {
            throw new RuntimeException("Missing S3_BUCKET_NAME environment variable!");
        }

        // Initialize S3 Client
        S3Client s3Client = S3Client.builder()
                .region(Region.US_EAST_1) // change if your bucket is not in us-east-1
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();

        // Prepare the key in S3 bucket
        LocalDate today = LocalDate.now();
        String s3Key = "reports/weekly_summary_" + today.toString() + ".csv";

        // Upload file
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .build();

        s3Client.putObject(putRequest, Paths.get(filePath));

        System.out.println("✅ CSV file uploaded successfully to S3 at: " + s3Key);
    }
}
