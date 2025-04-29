package com.fittracklite.batchjob.repository;

import com.fittracklite.batchjob.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
