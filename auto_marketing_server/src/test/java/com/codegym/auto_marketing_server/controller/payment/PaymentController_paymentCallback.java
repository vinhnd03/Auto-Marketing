package com.codegym.auto_marketing_server.controller.payment;

import com.codegym.auto_marketing_server.config.vnpay.VNPayConfig;
import com.codegym.auto_marketing_server.controller.vnpay.PaymentController;
import com.codegym.auto_marketing_server.service.ITransactionService;
import com.codegym.auto_marketing_server.service.vnpay.VNPayService;
import com.codegym.auto_marketing_server.util.vnpay.VNPayUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.*;

class PaymentController_paymentCallback {

    @Mock
    private VNPayService vnPayService;

    @Mock
    private ITransactionService transactionService;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private PaymentController paymentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void paymentCallback_successPayment_shouldCallTransactionAndRedirect() throws IOException {
        // Mô phỏng params trả về từ VNPay khi thanh toán thành công (responseCode = "00")
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Amount", "100000");
        params.put("vnp_TxnRef", "TX123");
        params.put("vnp_OrderInfo", "Service|1|5|30");
        params.put("vnp_ResponseCode", "00");
        params.put("vnp_SecureHash", "dummyhash");

        // Mock config để cung cấp secret
        VNPayConfig mockConfig = mock(VNPayConfig.class);
        when(mockConfig.getVnpHashSecret()).thenReturn("secret");
        when(vnPayService.getConfig()).thenReturn(mockConfig);

        // Mock static methods để hash và build query khớp với giá trị giả lập
        try (MockedStatic<VNPayUtil> mocked = mockStatic(VNPayUtil.class)) {
            mocked.when(() -> VNPayUtil.buildQueryString(any())).thenReturn("someData");
            mocked.when(() -> VNPayUtil.hmacSHA512(eq("secret"), anyString())).thenReturn("dummyhash");

            // Mock response và transactionService để tránh ném exception
            doNothing().when(response).sendRedirect(anyString());
            doNothing().when(transactionService).handlePayment(anyString(), anyLong(), anyString(), anyLong(), anyString());

            // Gọi hàm callback
            paymentController.paymentCallback(params, response);

            // Kiểm tra transactionService được gọi đúng với status "success"
            verify(transactionService).handlePayment("TX123", 1000L, "Service", 1L, "success");
            verify(response).sendRedirect(anyString());
        }
    }

    @Test
    void paymentCallback_failedPayment_shouldCallTransactionAndRedirect() throws IOException {
        // Mô phỏng params trả về từ VNPay khi thanh toán thất bại (responseCode khác "00")
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Amount", "100000");
        params.put("vnp_TxnRef", "TX124");
        params.put("vnp_OrderInfo", "Service|1|5|30");
        params.put("vnp_ResponseCode", "51"); // code lỗi: tài khoản không đủ số dư
        params.put("vnp_SecureHash", "dummyhash");

        VNPayConfig mockConfig = mock(VNPayConfig.class);
        when(mockConfig.getVnpHashSecret()).thenReturn("secret");
        when(vnPayService.getConfig()).thenReturn(mockConfig);

        try (MockedStatic<VNPayUtil> mocked = mockStatic(VNPayUtil.class)) {
            mocked.when(() -> VNPayUtil.buildQueryString(any())).thenReturn("someData");
            mocked.when(() -> VNPayUtil.hmacSHA512(eq("secret"), anyString())).thenReturn("dummyhash");

            doNothing().when(response).sendRedirect(anyString());
            doNothing().when(transactionService).handlePayment(anyString(), anyLong(), anyString(), anyLong(), anyString());

            paymentController.paymentCallback(params, response);

            // Kiểm tra transactionService được gọi đúng với status "failed"
            verify(transactionService).handlePayment("TX124", 1000L, "Service", 1L, "failed");
            verify(response).sendRedirect(anyString());
        }
    }

    @Test
    void paymentCallback_invalidHash_shouldCallTransactionFailed() throws IOException {
        // Mô phỏng hash không hợp lệ (vnp_SecureHash khác hash tính toán)
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Amount", "100000");
        params.put("vnp_TxnRef", "TX125");
        params.put("vnp_OrderInfo", "Service|1|5|30");
        params.put("vnp_ResponseCode", "00");
        params.put("vnp_SecureHash", "wronghash"); // hash sai

        VNPayConfig mockConfig = mock(VNPayConfig.class);
        when(mockConfig.getVnpHashSecret()).thenReturn("secret");
        when(vnPayService.getConfig()).thenReturn(mockConfig);

        try (MockedStatic<VNPayUtil> mocked = mockStatic(VNPayUtil.class)) {
            mocked.when(() -> VNPayUtil.buildQueryString(any())).thenReturn("someData");
            mocked.when(() -> VNPayUtil.hmacSHA512(eq("secret"), anyString())).thenReturn("dummyhash");

            doNothing().when(response).sendRedirect(anyString());
            doNothing().when(transactionService).handlePayment(anyString(), anyLong(), anyString(), anyLong(), anyString());

            paymentController.paymentCallback(params, response);

            // Kiểm tra transactionService được gọi với status "failed" do hash không hợp lệ
            verify(transactionService).handlePayment("TX125", 1000L, "Service", 1L, "failed");
            verify(response).sendRedirect(anyString());
        }
    }

    @Test
    void paymentCallback_missingParams_shouldRedirectWithError() throws IOException {
        // Mô phỏng trường hợp thiếu tham số bắt buộc
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Amount", "100000"); // thiếu vnp_TxnRef và vnp_OrderInfo

        // Gọi callback
        paymentController.paymentCallback(params, response);

        // Kiểm tra redirect về trang lỗi do thiếu params
        verify(response).sendRedirect("http://localhost:3000/payment-result?success=false&message=Missing+parameters");
        // Không gọi transactionService trong trường hợp thiếu params
        verifyNoInteractions(transactionService);
    }
}
