package com.codegym.auto_marketing_server.controller.vnpay;


import com.codegym.auto_marketing_server.service.ITransactionService;
import com.codegym.auto_marketing_server.service.vnpay.VNPayService;
import com.codegym.auto_marketing_server.util.vnpay.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

@RestController
@RequestMapping("${api.prefix}/payment")
//@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PaymentController {
    private final VNPayService vnPayService;
    private final ITransactionService transactionService;

    @PostMapping
    public Map<String, String> createPayment(@RequestBody Map<String, Object> requestData, HttpServletRequest request) {
        String serviceName = requestData.get("serviceName").toString();
        int amount = ((Number) requestData.get("amount")).intValue();
        Long userId = ((Number) requestData.get("userId")).longValue();

        String orderInfo = serviceName + "|" + userId;

        // 👉 Sử dụng service để tạo payment URL
        String paymentUrl = vnPayService.createPaymentUrl(request, amount, orderInfo);

        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        return response;
    }


    @GetMapping("/vn-pay-callback")
    public void paymentCallback(@RequestParam Map<String, String> allParams, HttpServletResponse response) throws IOException {
        // Kiểm tra các tham số bắt buộc
        if (allParams.get("vnp_Amount") == null || allParams.get("vnp_TxnRef") == null || allParams.get("vnp_OrderInfo") == null) {
            response.sendRedirect("http://localhost:3000/payment-result?success=false&message=Missing+parameters");
            return;
        }

        String vnp_SecureHash = allParams.remove("vnp_SecureHash");
        String data = VNPayUtil.buildQueryString(new TreeMap<>(allParams));
        String expectedHash = VNPayUtil.hmacSHA512(vnPayService.getConfig().getVnpHashSecret(), data);

        boolean validSignature = expectedHash.equals(vnp_SecureHash);
        String responseCode = allParams.get("vnp_ResponseCode");
        boolean success = validSignature && "00".equals(responseCode);
        String errorMessage = VNPAY_ERROR_CODES.getOrDefault(responseCode, "Lỗi không xác định");
        String message;

        if (success) {
            message = "Thanh toán thành công!";
        } else if (validSignature) {
            message = "Giao dịch không thành công. " + errorMessage;
        } else {
            message = "Xác minh chữ ký thất bại!";
        }

        long amount = Long.parseLong(allParams.get("vnp_Amount")) / 100;
        String[] parts = allParams.get("vnp_OrderInfo").split("\\|");
        String txnRef = allParams.get("vnp_TxnRef");

        String service = parts[0];
        Long userId = Long.valueOf(parts[1]);

        // Gọi transactionService dù thành công hay thất bại
        String status = success ? "success" : "failed";
        transactionService.handlePayment(txnRef, amount, service, userId, status);

        String redirectUrl = String.format(
                "http://localhost:3000/payment-result?success=%s&message=%s&amount=%d&service=%s&txnRef=%s",
                success,
                URLEncoder.encode(message, StandardCharsets.UTF_8),
                amount,
                URLEncoder.encode(service, StandardCharsets.UTF_8),
                txnRef
        );

        response.sendRedirect(redirectUrl);
    }


    private static final Map<String, String> VNPAY_ERROR_CODES = Map.ofEntries(
            Map.entry("00", "Giao dịch thành công"),
            Map.entry("07", "Trừ tiền thành công. Giao dịch bị nghi ngờ"),
            Map.entry("09", "Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking"),
            Map.entry("10", "Khách hàng xác thực thất bại"),
            Map.entry("11", "Hết hạn chờ thanh toán"),
            Map.entry("12", "Thẻ/Tài khoản bị khóa"),
            Map.entry("13", "Nhập sai mật khẩu OTP quá số lần"),
            Map.entry("24", "Khách hàng hủy giao dịch"),
            Map.entry("51", "Tài khoản không đủ số dư"),
            Map.entry("65", "Vượt quá hạn mức giao dịch"),
            Map.entry("75", "Ngân hàng đang bảo trì"),
            Map.entry("79", "Nhập sai mật khẩu OTP"),
            Map.entry("99", "Lỗi không xác định")
    );
}
