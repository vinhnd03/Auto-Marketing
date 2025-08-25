package com.codegym.auto_marketing_server.controller.payment;

import com.codegym.auto_marketing_server.config.vnpay.VNPayConfig;
import com.codegym.auto_marketing_server.service.ITransactionService;
import com.codegym.auto_marketing_server.service.vnpay.VNPayService;
import com.codegym.auto_marketing_server.util.vnpay.VNPayUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrlPattern;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class PaymentController_vnpCallback {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ITransactionService transactionService;

    @MockBean
    private VNPayService vnPayService;

    @Test
    public void vnpCallback_SuccessRedirect_mockConfig() throws Exception {
        // Fake config
        VNPayConfig fakeConfig = Mockito.mock(VNPayConfig.class);
        Mockito.when(fakeConfig.getVnpHashSecret()).thenReturn("FAKE_SECRET");
        Mockito.when(vnPayService.getConfig()).thenReturn(fakeConfig);

        // Fake params từ VNPay
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Amount", "100000");
        params.put("vnp_TxnRef", "123456");
        params.put("vnp_OrderInfo", "Premium|1");
        params.put("vnp_ResponseCode", "00");

        // Tạo chữ ký giả đúng
        String data = VNPayUtil.buildQueryString(new TreeMap<>(params));
        String hash = VNPayUtil.hmacSHA512("FAKE_SECRET", data);
        params.put("vnp_SecureHash", hash);

        // Mock transactionService không làm gì
        Mockito.doNothing().when(transactionService)
                .handleSuccessfulPayment(Mockito.anyString(), Mockito.anyLong(), Mockito.anyString(), Mockito.anyLong());

        mockMvc.perform(get("/api/payment/vn-pay-callback")
                        .param("vnp_Amount", params.get("vnp_Amount"))
                        .param("vnp_TxnRef", params.get("vnp_TxnRef"))
                        .param("vnp_OrderInfo", params.get("vnp_OrderInfo"))
                        .param("vnp_ResponseCode", params.get("vnp_ResponseCode"))
                        .param("vnp_SecureHash", params.get("vnp_SecureHash"))
                )
                .andDo(print())
                .andExpect(status().is3xxRedirection());
    }

    @Test
    public void vnpCallback_FailedPayment_mockConfig() throws Exception {
        VNPayConfig fakeConfig = Mockito.mock(VNPayConfig.class);
        Mockito.when(fakeConfig.getVnpHashSecret()).thenReturn("FAKE_SECRET");
        Mockito.when(vnPayService.getConfig()).thenReturn(fakeConfig);

        Map<String, String> params = new HashMap<>();
        params.put("vnp_Amount", "100000");
        params.put("vnp_TxnRef", "123456");
        params.put("vnp_OrderInfo", "Premium|1");
        params.put("vnp_ResponseCode", "01"); // thất bại

        String data = VNPayUtil.buildQueryString(new TreeMap<>(params));
        String hash = VNPayUtil.hmacSHA512("FAKE_SECRET", data);
        params.put("vnp_SecureHash", hash);

        mockMvc.perform(get("/api/payment/vn-pay-callback")
                        .param("vnp_Amount", params.get("vnp_Amount"))
                        .param("vnp_TxnRef", params.get("vnp_TxnRef"))
                        .param("vnp_OrderInfo", params.get("vnp_OrderInfo"))
                        .param("vnp_ResponseCode", params.get("vnp_ResponseCode"))
                        .param("vnp_SecureHash", params.get("vnp_SecureHash"))
                ).
        andDo(print())
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrlPattern("http://localhost:3000/payment-result?success=false*"));
    }

    @Test
    public void vnpCallback_InvalidHash_mockConfig() throws Exception {
        VNPayConfig fakeConfig = Mockito.mock(VNPayConfig.class);
        Mockito.when(fakeConfig.getVnpHashSecret()).thenReturn("FAKE_SECRET");
        Mockito.when(vnPayService.getConfig()).thenReturn(fakeConfig);

        mockMvc.perform(get("/api/payment/vn-pay-callback")
                        .param("vnp_Amount", "100000")
                        .param("vnp_TxnRef", "123456")
                        .param("vnp_OrderInfo", "Premium|1")
                        .param("vnp_ResponseCode", "00")
                        .param("vnp_SecureHash", "WRONG_HASH")
                ).
                andDo(print())
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrlPattern("http://localhost:3000/payment-result?success=false*"));
    }

    @BeforeEach
    void setup() {
        // Mock VNPayConfig để tránh NullPointerException
        VNPayConfig mockConfig = Mockito.mock(VNPayConfig.class);
        Mockito.when(mockConfig.getVnpHashSecret()).thenReturn("TEST_SECRET");

        // Mock VNPayService trả về config này
        Mockito.when(vnPayService.getConfig()).thenReturn(mockConfig);
    }

    @Test
    public void vnpCallback_MissingParam_safe() throws Exception {
        // Mock VNPayConfig
        VNPayConfig fakeConfig = Mockito.mock(VNPayConfig.class);
        Mockito.when(fakeConfig.getVnpHashSecret()).thenReturn("FAKE_SECRET");
        Mockito.when(vnPayService.getConfig()).thenReturn(fakeConfig);

        // Gửi request thiếu param "vnp_TxnRef"
        mockMvc.perform(get("/api/payment/vn-pay-callback")
                                .param("vnp_Amount", "100000")
                                .param("vnp_OrderInfo", "Premium|1")
                                .param("vnp_ResponseCode", "00")
                        // Không thêm vnp_TxnRef
                )
                .andDo(print())
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrlPattern(
                        "http://localhost:3000/payment-result?success=false*"
                ));
    }
}
