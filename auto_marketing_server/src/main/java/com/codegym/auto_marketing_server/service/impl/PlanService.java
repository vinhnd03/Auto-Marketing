package com.codegym.auto_marketing_server.service.impl;


import com.codegym.auto_marketing_server.repository.IPlanRepository;
import com.codegym.auto_marketing_server.service.IPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlanService implements IPlanService {
    private final IPlanRepository planRepository;
}
