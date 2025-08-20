package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Plan;

import java.util.List;

public interface IPlanService {
    Plan findByName(String name);

    List<Plan> getAll();
}
