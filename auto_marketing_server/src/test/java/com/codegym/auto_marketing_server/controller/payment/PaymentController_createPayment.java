package com.codegym.auto_marketing_server.controller.payment;

import com.codegym.auto_marketing_server.controller.vnpay.PaymentController;
import com.codegym.auto_marketing_server.entity.Plan;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.service.IPlanService;
import com.codegym.auto_marketing_server.service.IUserService;
import com.codegym.auto_marketing_server.service.vnpay.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

public class PaymentController_createPayment {

    @Mock
    private VNPayService vnPayService;

    @Mock
    private IUserService userService;

    @Mock
    private IPlanService planService;

    @Mock
    private HttpServletRequest httpServletRequest;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private PaymentController paymentController;

    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
    }

    @Test
    void createPayment_withValidData_shouldReturnPaymentUrl() {
        // ✅ Arrange
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("serviceName", "Premium");
        requestData.put("amount", 1000);
        requestData.put("maxWorkspace", 5);
        requestData.put("duration", 30);

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        Plan plan = new Plan();
        plan.setId(99L);
        when(planService.findByName("Premium")).thenReturn(plan);

        String expectedUrl = "http://pay.vn/123";
        when(vnPayService.createPaymentUrl(httpServletRequest, 1000, "Premium|1|5|30", 1L, 99L))
                .thenReturn(expectedUrl);

        // ✅ Act
        ResponseEntity<?> response = paymentController.createPayment(requestData, httpServletRequest, authentication);

        // ✅ Assert
        assertEquals(200, response.getStatusCodeValue());
        Map<String, String> body = (Map<String, String>) response.getBody();
        assertEquals(expectedUrl, body.get("paymentUrl"));
    }

    @Test
    void createPayment_withNullOptionalFields_shouldStillWork() {
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("serviceName", "Basic");
        requestData.put("amount", 500);

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        Plan plan = new Plan();
        plan.setId(88L);
        when(planService.findByName("Basic")).thenReturn(plan);

        String expectedUrl = "http://pay.vn/456";
        when(vnPayService.createPaymentUrl(httpServletRequest, 500, "Basic|1|null|0", 1L, 88L))
                .thenReturn(expectedUrl);

        ResponseEntity<?> response = paymentController.createPayment(requestData, httpServletRequest, authentication);

        assertEquals(200, response.getStatusCodeValue());
        Map<String, String> body = (Map<String, String>) response.getBody();
        assertEquals(expectedUrl, body.get("paymentUrl"));
    }

    @Test
    void createPayment_whenServiceThrowsException_shouldReturn500() {
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("serviceName", "Pro");
        requestData.put("amount", 2000);

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        Plan plan = new Plan();
        plan.setId(77L);
        when(planService.findByName("Pro")).thenReturn(plan);

        when(vnPayService.createPaymentUrl(httpServletRequest, 2000, "Pro|1|null|0", 1L, 77L))
                .thenThrow(new RuntimeException("Service error"));

        ResponseEntity<?> response = paymentController.createPayment(requestData, httpServletRequest, authentication);

        assertEquals(500, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Service error"));
    }
}
