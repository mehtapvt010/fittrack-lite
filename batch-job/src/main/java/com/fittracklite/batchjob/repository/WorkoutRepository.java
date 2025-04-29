package com.fittracklite.batchjob.repository;

import com.fittracklite.batchjob.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkoutRepository extends JpaRepository<Workout, String> {
    List<Workout> findByUserIdAndDateBetween(String userId, java.util.Date start, java.util.Date end);
}
