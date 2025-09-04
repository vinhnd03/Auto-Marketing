package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.entity.Plan;
import com.codegym.auto_marketing_server.service.IPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/plans")
@RequiredArgsConstructor
public class AdminPlanController {
    private final IPlanService planService;

    @GetMapping
    public ResponseEntity<List<Plan>> getAllPlans() {
        return ResponseEntity.ok(planService.getAllPlans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plan> getPlanById(@PathVariable Long id) {
        Optional<Plan> plan = planService.findById(id);
        if (!plan.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(plan.get(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Plan> createPlan(@Valid @RequestBody Plan plan) {
        return new ResponseEntity<>(planService.save(plan), HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Plan> updatePlan(@PathVariable Long id, @Valid @RequestBody Plan plan) {
        Optional<Plan> optionalPlan = planService.findById(id);
        if (!optionalPlan.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        plan.setId(optionalPlan.get().getId());
        return new ResponseEntity<>(planService.update(plan), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlan(@PathVariable Long id) {
        planService.deleteById(id);
        return ResponseEntity.ok("Plan deleted (soft delete)");
    }

}
