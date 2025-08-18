package com.codegym.auto_marketing_server.controller.plan;

import com.codegym.auto_marketing_server.entity.Plan;
import com.codegym.auto_marketing_server.service.IPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/plans")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PlanController {
    private final IPlanService planService;

    @GetMapping("")
    public ResponseEntity<?> getAllPlans() {
        List<Plan> planList = planService.getAll();
        if (planList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(planList, HttpStatus.OK);
    }
}
