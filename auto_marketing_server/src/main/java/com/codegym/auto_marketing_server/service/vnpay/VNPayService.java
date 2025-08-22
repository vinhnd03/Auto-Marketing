package com.codegym.auto_marketing_server.service.vnpay;


import com.codegym.auto_marketing_server.config.vnpay.VNPayConfig;
import com.codegym.auto_marketing_server.util.vnpay.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VNPayService {
    private final VNPayConfig vnPayConfig;
    public String createPaymentUrl(HttpServletRequest request, long amount, String orderInfo) {
        String vnp_TxnRef = String.valueOf(System.currentTimeMillis());
        String vnp_IpAddr = request.getRemoteAddr();
        String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnPayConfig.getVnpVersion());
        vnp_Params.put("vnp_Command", vnPayConfig.getVnpCommand());
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getVnpTmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", vnPayConfig.getVnpOrderType());
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getVnpReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        //tham số vnpay yêu cầu

        //  Sort lại VNPay bắt buộc sort theo thứ tự A–Z trước khi tạo chuỗi ký (hashData).
        SortedMap<String, String> sortedParams = new TreeMap<>(vnp_Params);

        //  Tạo chuỗi hashData KHÔNG encode
        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            if (hashData.length() > 0) {
                hashData.append('&');
            }
            hashData.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII))
                    .append('=')
                    .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
        } // Xoá dấu & cuối cùng

        //  Tạo chữ ký HMAC
        String secureHash = VNPayUtil.hmacSHA512(vnPayConfig.getVnpHashSecret(), hashData.toString());

        // Build query URL (có encode)
        String queryUrl = VNPayUtil.buildQueryString(sortedParams);

        //  Trả lại URL thanh toán
        return vnPayConfig.getVnpUrl() + "?" + queryUrl + "&vnp_SecureHash=" + secureHash;
    }

    public VNPayConfig getConfig() {
        return vnPayConfig;
    }

}
