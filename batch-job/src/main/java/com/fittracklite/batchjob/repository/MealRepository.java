package com.fittracklite.batchjob.repository;

import com.fittracklite.batchjob.model.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MealRepository extends JpaRepository<Meal, String> {
    List<Meal> findByUserIdAndCreatedAtBetween(String userId, java.util.Date start, java.util.Date end);
}
