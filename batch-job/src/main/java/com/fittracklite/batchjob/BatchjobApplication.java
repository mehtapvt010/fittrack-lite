package com.fittracklite.batchjob;

import com.fittracklite.batchjob.service.SummaryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class BatchjobApplication implements CommandLineRunner {

    private final SummaryService summaryService;

    @Autowired
    private ConfigurableApplicationContext context;

    public BatchjobApplication(SummaryService summaryService) {
        this.summaryService = summaryService;
    }

    public static void main(String[] args) {
        SpringApplication.run(BatchjobApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Job running");
        summaryService.generateWeeklySummary();
        System.out.println("Job finished, shutting down...");

        // Shutdown the Spring Boot app gracefully
        int exitCode = SpringApplication.exit(context, () -> 0);
        System.exit(exitCode);
    }
}
