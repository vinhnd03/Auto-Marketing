package com.codegym.auto_marketing_server.enums;

public enum CampaignStatus {
    DRAFT("Nháp"),
    ACTIVE("Đang hoạt động"),
    COMPLETED("Hoàn thành"),
    PAUSED("Tạm dừng");

    private final String vietnamese;

    CampaignStatus(String vietnamese) {
        this.vietnamese = vietnamese;
    }

    public String getVietnamese() {
        return vietnamese;
    }
}
