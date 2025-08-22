package com.codegym.auto_marketing_server.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class WeekStatisticDTO {
    private int week;
    private long count;

    public WeekStatisticDTO(int week, long count) {
        this.week = week;
        this.count = count;
    }

}
