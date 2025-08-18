package com.codegym.auto_marketing_server.service.impl;


import com.codegym.auto_marketing_server.entity.Plan;
import com.codegym.auto_marketing_server.repository.IPlanRepository;
import com.codegym.auto_marketing_server.service.IPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanService implements IPlanService {
    private final IPlanRepository planRepository;

    @Override
    public Plan findByName(String name) {
        return planRepository.findByName(name);
    }


    @Override
    public List<Plan> getAll() {
        return planRepository.findAll();
    }
}
