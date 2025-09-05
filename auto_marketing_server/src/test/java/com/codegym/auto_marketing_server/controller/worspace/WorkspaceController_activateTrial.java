package com.codegym.auto_marketing_server.controller.worspace;

import com.codegym.auto_marketing_server.controller.workspace.WorkspaceController;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.service.IUserService;
import com.codegym.auto_marketing_server.service.impl.SubscriptionManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class WorkspaceController_activateTrial {

    @Mock
    private SubscriptionManagementService subscriptionManagementService;

    @Mock
    private IUserService userService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private WorkspaceController workspaceController;

    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
    }

    /**
     * Case 1: Authentication null → 401
     */
    @Test
    void activateTrial_caseNotAuthenticated() {
        ResponseEntity<?> response = workspaceController.activateTrial(null);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Not authenticated", response.getBody());
    }

    /**
     * Case 2: Không tìm thấy user → 404
     */
    @Test
    void activateTrial_caseUserNotFound() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userService.findByEmail(mockUser.getEmail())).thenReturn(Optional.empty());

        ResponseEntity<?> response = workspaceController.activateTrial(authentication);

        assertEquals(404, response.getStatusCodeValue());
        assertEquals("Không tìm thấy người dùng", response.getBody());
    }

    /**
     * Case 3: Kích hoạt Trial thành công
     */
    @Test
    void activateTrial_caseSuccess() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userService.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

        doNothing().when(subscriptionManagementService).activateTrialPlan(mockUser.getId());

        ResponseEntity<?> response = workspaceController.activateTrial(authentication);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Đã kích hoạt gói Trial", response.getBody());

        verify(subscriptionManagementService, times(1)).activateTrialPlan(mockUser.getId());
    }

    /**
     * Case 4: Service ném Exception → 400
     */
    @Test
    void activateTrial_caseException() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userService.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

        doThrow(new RuntimeException("Trial đã được kích hoạt"))
                .when(subscriptionManagementService).activateTrialPlan(mockUser.getId());

        ResponseEntity<?> response = workspaceController.activateTrial(authentication);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Trial đã được kích hoạt", response.getBody());
    }
}
