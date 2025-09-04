package com.codegym.auto_marketing_server.controller.plan;

import com.codegym.auto_marketing_server.entity.Plan;
import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.service.IPlanService;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import com.codegym.auto_marketing_server.service.ITransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/plans")
@RequiredArgsConstructor
public class PlanController {
    private final IPlanService planService;
    private final ISubscriptionService subscriptionService;
    private final ITransactionService transactionService;

    @GetMapping("")
    public ResponseEntity<?> getAllPlans() {
        List<Plan> planList = planService.findAllAvailablePlan();
        if (planList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(planList, HttpStatus.OK);
    }

    @GetMapping("/currentPlan/{id}")
    public ResponseEntity<?> getCurrentPlan(@PathVariable("id") Long userId) {
        if (userId != null) {
            Optional<Subscription> subscription = subscriptionService.findActiveByUserId(userId);

            if (subscription.isEmpty()) {
                return new ResponseEntity<>(null, HttpStatus.OK);
            }

            int countSubscriptionByPlantName = subscriptionService.countSubscriptionByPlantName(subscription.get().getPlan().getName(), userId);
            LocalDate endDate = subscription.get().getEndDate().plusDays((long) (countSubscriptionByPlantName - 1) * subscription.get().getPlan().getDurationDate());
            subscription.get().setEndDate(endDate);
            return new ResponseEntity<>(subscription, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/getMostPopular")
    public ResponseEntity<?> getMostPopular() {
        String mostPopularPlant = transactionService.getMostPopularPackage();
        if (mostPopularPlant.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(mostPopularPlant, HttpStatus.OK);
    }
}
