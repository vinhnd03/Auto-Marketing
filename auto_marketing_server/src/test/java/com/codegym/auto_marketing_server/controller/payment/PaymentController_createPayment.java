package com.codegym.auto_marketing_server.controller.payment;

import com.codegym.auto_marketing_server.controller.vnpay.PaymentController;
import com.codegym.auto_marketing_server.service.vnpay.VNPayService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
public class PaymentController_createPayment {
    @Mock
    private VNPayService vnPayService;

    @Mock
    private HttpServletRequest httpServletRequest;

    @InjectMocks
    private PaymentController paymentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void createPayment_withValidData_shouldReturnPaymentUrl() {
        // ✅ Test case 1: Truyền đủ dữ liệu hợp lệ → service trả về payment URL
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("serviceName", "Premium");
        requestData.put("amount", 1000);
        requestData.put("userId", 1L);
        requestData.put("maxWorkspace", 5);
        requestData.put("duration", 30);

        String expectedUrl = "http://pay.vn/123";
        when(vnPayService.createPaymentUrl(httpServletRequest, 1000, "Premium|1|5|30"))
                .thenReturn(expectedUrl);

        Map<String, String> response = paymentController.createPayment(requestData, httpServletRequest);

        assertEquals(expectedUrl, response.get("paymentUrl"));
    }

    @Test
    void createPayment_withNullOptionalFields_shouldStillWork() {
        // ✅ Test case 2: maxWorkspace = null, duration = null → service vẫn tạo orderInfo với giá trị mặc định
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("serviceName", "Basic");
        requestData.put("amount", 500);
        requestData.put("userId", 2L);

        String expectedUrl = "http://pay.vn/456";
        when(vnPayService.createPaymentUrl(httpServletRequest, 500, "Basic|2|null|0"))
                .thenReturn(expectedUrl);

        Map<String, String> response = paymentController.createPayment(requestData, httpServletRequest);

        assertEquals(expectedUrl, response.get("paymentUrl"));
    }

    @Test
    void createPayment_whenServiceThrowsException_shouldPropagate() {
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("serviceName", "Pro");
        requestData.put("amount", 2000);
        requestData.put("userId", 3L);

        when(vnPayService.createPaymentUrl(httpServletRequest, 2000, "Pro|3|null|0"))
                .thenThrow(new RuntimeException("Service error"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentController.createPayment(requestData, httpServletRequest);
        });
        assertEquals("Service error", exception.getMessage());
    }
}
