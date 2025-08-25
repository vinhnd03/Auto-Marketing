package com.codegym.auto_marketing_server.controller.worspace;


import com.codegym.auto_marketing_server.controller.workspace.WorkspaceController;

import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;


public class WorkspaceController_workspaceLimit {

    @Mock
    private ISubscriptionService subscriptionService;

    @InjectMocks
    private WorkspaceController workspaceController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Case 1: User có subscription active -> trả về số workspace tối đa
     */
    @Test
    void workspaceLimit_caseUserHasActiveSubscription() {
        Long userId = 1L;
        Subscription subscription = new Subscription();
        subscription.setId(10L);

        when(subscriptionService.findActiveByUserId(userId))
                .thenReturn(Optional.of(subscription));
        when(subscriptionService.findMaxWorkspaceByCurrenSubscription(subscription.getId()))
                .thenReturn(5);

        ResponseEntity<?> response = workspaceController.workspaceLimit(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(5, response.getBody());
    }

    /**
     * Case 2: User không có subscription hoặc đã hết hạn -> trả về message
     */
    @Test
    void workspaceLimit_caseUserNoActiveSubscription() {
        Long userId = 2L;

        when(subscriptionService.findActiveByUserId(userId))
                .thenReturn(Optional.empty());

        ResponseEntity<?> response = workspaceController.workspaceLimit(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Bạn chưa mua gói dịch vụ hoặc gói của bạn đã hết hạn", response.getBody());
    }

}
