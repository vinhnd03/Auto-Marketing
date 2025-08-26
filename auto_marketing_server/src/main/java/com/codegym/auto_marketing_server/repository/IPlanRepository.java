package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPlanRepository extends JpaRepository<Plan, Long> {
    Plan findByName(String name);
    List<Plan> findByDeletedFalse();

    List<Plan> findAllByDeletedFalse();
}
