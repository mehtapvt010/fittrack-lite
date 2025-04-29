package com.fittracklite.batchjob.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "\"User\"")
public class User {
    @Id
    private String id;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "createdAt")
    private Instant createdAt;

    @Column(name = "weeklyGoal")
    private Integer weeklyGoal;

    @Column(name = "weeklyCalorieGoal")
    private Integer weeklyCalorieGoal;

    @Column(name = "carbsTarget")
    private Integer carbsTarget;

    @Column(name = "fatTarget")
    private Integer fatTarget;

    @Column(name = "proteinTarget")
    private Integer proteinTarget;

    // ---- Getter and Setter methods ----

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getWeeklyGoal() {
        return weeklyGoal;
    }

    public void setWeeklyGoal(Integer weeklyGoal) {
        this.weeklyGoal = weeklyGoal;
    }

    public Integer getWeeklyCalorieGoal() {
        return weeklyCalorieGoal;
    }

    public void setWeeklyCalorieGoal(Integer weeklyCalorieGoal) {
        this.weeklyCalorieGoal = weeklyCalorieGoal;
    }

    public Integer getCarbsTarget() {   // <-- exact match
        return carbsTarget;
    }

    public void setCarbsTarget(Integer carbsTarget) {
        this.carbsTarget = carbsTarget;
    }

    public Integer getFatTarget() {   // <-- exact match
        return fatTarget;
    }

    public void setFatTarget(Integer fatTarget) {
        this.fatTarget = fatTarget;
    }

    public Integer getProteinTarget() {   // <-- exact match
        return proteinTarget;
    }

    public void setProteinTarget(Integer proteinTarget) {
        this.proteinTarget = proteinTarget;
    }
}
