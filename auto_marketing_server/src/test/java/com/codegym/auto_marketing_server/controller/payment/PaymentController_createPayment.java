package com.codegym.auto_marketing_server.controller.payment;

import com.codegym.auto_marketing_server.service.vnpay.VNPayService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashMap;
import java.util.Map;

@SpringBootTest
@AutoConfigureMockMvc
public class PaymentController_createPayment {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private VNPayService vnPayService;

    @Test
    public void createPayment_validRequest_ReturnUrl() throws Exception {
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("serviceName", "Premium");
        requestData.put("amount", 100000);
        requestData.put("userId", 1L);

        // Mock hàm trong service
        Mockito.when(vnPayService.createPaymentUrl(
                Mockito.any(HttpServletRequest.class),
                Mockito.eq(100000L),
                Mockito.eq("Premium|1")
        )).thenReturn("http://example.com/pay");

        mockMvc.perform(post("/api/payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestData)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentUrl").value("http://example.com/pay"));
    }
}
