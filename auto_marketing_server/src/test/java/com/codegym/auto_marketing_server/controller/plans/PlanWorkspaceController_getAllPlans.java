package com.codegym.auto_marketing_server.controller.plans;

import com.codegym.auto_marketing_server.controller.plan.PlanController;
import com.codegym.auto_marketing_server.entity.Plan;
import com.codegym.auto_marketing_server.service.IPlanService;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import com.codegym.auto_marketing_server.service.ITransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
public class PlanWorkspaceController_getAllPlans {
    private IPlanService planService;
    private PlanController planController;

    @BeforeEach
    void setUp() {
        planService = Mockito.mock(IPlanService.class);
        ISubscriptionService subscriptionService = Mockito.mock(ISubscriptionService.class);
        ITransactionService transactionService = Mockito.mock(ITransactionService.class);

        planController = new PlanController(planService, subscriptionService, transactionService);
    }

    @Test
    void getAllPlans_caseEmptyList_shouldReturnNoContent() {
        // given
        when(planService.getAll()).thenReturn(Collections.emptyList());

        // when
        ResponseEntity<?> response = planController.getAllPlans();

        // then
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
        verify(planService, times(1)).getAll();
    }

    @Test
    void getAllPlans_caseNonEmptyList_shouldReturnOkAndList() {
        // given
        Plan plan1 = new Plan();
        plan1.setId(1L);
        plan1.setName("Basic");
        Plan plan2 = new Plan();
        plan2.setId(2L);
        plan2.setName("Premium");

        List<Plan> plans = Arrays.asList(plan1, plan2);
        when(planService.getAll()).thenReturn(plans);

        // when
        ResponseEntity<?> response = planController.getAllPlans();

        // then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof List);
        List<?> responseBody = (List<?>) response.getBody();
        assertEquals(2, responseBody.size());
        verify(planService, times(1)).getAll();
    }
}

