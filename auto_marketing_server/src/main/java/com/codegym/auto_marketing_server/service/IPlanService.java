package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Plan;

import java.util.List;
import java.util.Optional;

public interface IPlanService {
    List<Plan> findAll();

    void save(Plan plans);

    Optional<Plan> findById(Long id);

    void remove(Long id);
}
