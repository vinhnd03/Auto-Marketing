package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Plan;

import java.util.List;

import com.codegym.auto_marketing_server.entity.Plan;

import java.util.List;
import java.util.Optional;

public interface IPlanService {
    Plan findByName(String name);

    List<Plan> getAll();
    List<Plan> getAllPlans();

    Optional<Plan> findById(Long id);

    Plan save(Plan plan);

    Plan update(Plan plan);

    void deleteById(Long id);
}
