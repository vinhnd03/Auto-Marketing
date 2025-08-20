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
    public void save(Plan plans) {
        planRepository.save(plans);
    }

    @Override
    public Optional<Plan> findById(Long id) {
        return planRepository.findById(id);
    }

    @Override
    public void remove(Long id) {
        planRepository.deleteById(id);
    }
}
