package com.codegym.auto_marketing_server.service.impl;


import com.codegym.auto_marketing_server.entity.Plan;
import com.codegym.auto_marketing_server.repository.IPlanRepository;
import com.codegym.auto_marketing_server.service.IPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlanService implements IPlanService {
    private final IPlanRepository planRepository;

    @Override
    public List<Plan> findAll() {
        return planRepository.findAll();
    }

    @Override
    public Optional<Plan> findById(Long id) {
        return planRepository.findById(id);
    }

    @Override
    public Plan save(Plan plan) {
        return planRepository.save(plan);
    }

    @Override
    public Plan update(Plan plan) {
        return planRepository.save(plan);
    }

    @Override
    public void deleteById(Long id) {
        if (!planRepository.existsById(id)) {
            throw new RuntimeException("Plan not found with id " + id);
        }
        planRepository.deleteById(id);
    }
}
