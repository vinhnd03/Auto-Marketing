package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.User;
import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

import java.util.Optional;

public interface IUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    @Query(value = "SELECT u.id FROM users u join social_accounts sa on u.id=sa.user_id where sa.id=:id", nativeQuery = true)
    Long selectUserIdBySocialAccountId(@Param("id") Long id);

}
