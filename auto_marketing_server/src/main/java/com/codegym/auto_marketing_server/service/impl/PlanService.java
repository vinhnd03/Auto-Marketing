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
    public Plan findByName(String name) {
        return planRepository.findByName(name);
    }


    @Override
    public List<Plan> getAll() {
        return planRepository.findAll();
    }

    @Override
    public List<Plan> getAllPlans() {
        return planRepository.findByDeletedFalse();  // chỉ lấy chưa xóa
    }

    @Override
    public Optional<Plan> findById(Long id) {
        return planRepository.findById(id);
    }

    @Override
    public Plan save(Plan plan) {
        plan.setDeleted(false); // đảm bảo khi tạo mới không bị đánh dấu xóa
        return planRepository.save(plan);
    }

    @Override
    public Plan update(Plan plan) {
        return planRepository.save(plan);
    }

    @Override
    public void deleteById(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        plan.setDeleted(true);   // đánh dấu là đã xóa
        planRepository.save(plan);
    }
}
