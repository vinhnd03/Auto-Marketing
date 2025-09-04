package com.codegym.auto_marketing_server.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

//DTO tổng hợp để lấy 3 api vào 1 đường dẫn theo frontend tạo trước
@Setter
@Getter
public class StatisticResponse {
    private List<MonthStatisticDTO> monthly;
    private List<QuarterStatisticDTO> quarterly;
    private List<WeekStatisticDTO> weekly;
    public StatisticResponse() {
    }


    public StatisticResponse(List<MonthStatisticDTO> monthly, List<QuarterStatisticDTO> quarterly, List<WeekStatisticDTO> weekly) {
        this.monthly = monthly;
        this.quarterly = quarterly;
        this.weekly = weekly;
    }

}
