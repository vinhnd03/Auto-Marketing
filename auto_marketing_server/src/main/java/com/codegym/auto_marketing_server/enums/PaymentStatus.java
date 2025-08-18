package com.codegym.auto_marketing_server.enums;

public enum PaymentStatus {
    PENDING,    // Đã tạo đơn nhưng chưa thanh toán
    SUCCESS,    // Thanh toán thành công
    FAILED,     // Thanh toán thất bại
    CANCELLED,  // Bị hủy
}
