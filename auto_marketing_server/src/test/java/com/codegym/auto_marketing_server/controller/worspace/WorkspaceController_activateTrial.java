package com.codegym.auto_marketing_server.controller.worspace;



import com.codegym.auto_marketing_server.controller.workspace.WorkspaceController;
import com.codegym.auto_marketing_server.service.impl.SubscriptionManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
public class WorkspaceController_activateTrial {
    @Mock
    private SubscriptionManagementService subscriptionManagementService;

    @InjectMocks
    private WorkspaceController workspaceController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    /**
     * Case 1: Kích hoạt Trial thành công
     */
    @Test
    void activateTrial_caseSuccess() {
        Long userId = 1L;

        // Giả lập service chạy thành công
        doNothing().when(subscriptionManagementService).activateTrialPlan(userId);

        ResponseEntity<?> response = workspaceController.activateTrial(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Đã kích hoạt gói Trial", response.getBody());
    }

    /**
     * Case 2: Service ném Exception -> trả về BAD_REQUEST
     */
    @Test
    void activateTrial_caseException() {
        Long userId = 2L;

        // Giả lập service ném lỗi
        doThrow(new RuntimeException("Trial đã được kích hoạt"))
                .when(subscriptionManagementService).activateTrialPlan(userId);

        ResponseEntity<?> response = workspaceController.activateTrial(userId);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Trial đã được kích hoạt", response.getBody());
    }

}
