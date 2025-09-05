package com.codegym.auto_marketing_server.controller.worspace;


import com.codegym.auto_marketing_server.controller.workspace.WorkspaceController;

import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import com.codegym.auto_marketing_server.service.IUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;


public class WorkspaceController_workspaceLimit {

    @Mock
    private IUserService userService;

    @Mock
    private Authentication authentication;
    @Mock
    private ISubscriptionService subscriptionService;

    @InjectMocks
    private WorkspaceController workspaceController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    /**
     * Case 1: authentication null -> trả về 401
     */
    @Test
    void workspaceLimit_caseAuthenticationNull() {
        ResponseEntity<?> response = workspaceController.workspaceLimit(null);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Not authenticated", response.getBody());
    }

    /**
     * Case 2: authentication không authenticated -> trả về 401
     */
    @Test
    void workspaceLimit_caseNotAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(false);

        ResponseEntity<?> response = workspaceController.workspaceLimit(authentication);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Not authenticated", response.getBody());
    }

    /**
     * Case 3: Có subscription active -> trả về số workspace tối đa
     */
    @Test
    void workspaceLimit_caseUserHasActiveSubscription() {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");

        Subscription subscription = new Subscription();
        subscription.setId(10L);

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);

        when(userService.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));
        when(subscriptionService.findActiveByUserId(mockUser.getId())).thenReturn(Optional.of(subscription));
        when(subscriptionService.findMaxWorkspaceByCurrenSubscription(subscription.getId())).thenReturn(5);

        ResponseEntity<?> response = workspaceController.workspaceLimit(authentication);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(5, response.getBody());
    }

    /**
     * Case 4: Không có subscription active -> trả về message
     */
    @Test
    void workspaceLimit_caseUserNoActiveSubscription() {
        User mockUser = new User();
        mockUser.setId(2L);
        mockUser.setEmail("no-sub@example.com");

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);

        when(userService.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));
        when(subscriptionService.findActiveByUserId(mockUser.getId())).thenReturn(Optional.empty());

        ResponseEntity<?> response = workspaceController.workspaceLimit(authentication);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Bạn chưa mua gói dịch vụ hoặc gói của bạn đã hết hạn", response.getBody());
    }
}
