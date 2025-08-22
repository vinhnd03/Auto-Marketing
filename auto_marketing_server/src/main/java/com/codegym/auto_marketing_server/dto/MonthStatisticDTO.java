package com.codegym.auto_marketing_server.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MonthStatisticDTO {
    private int month;
    private long count;

    public MonthStatisticDTO(int month, long count) {
        this.month = month;
        this.count = count;
    }

}
