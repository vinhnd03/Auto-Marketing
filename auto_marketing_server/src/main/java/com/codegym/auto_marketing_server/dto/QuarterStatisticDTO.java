package com.codegym.auto_marketing_server.dto;


import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class QuarterStatisticDTO {
    private int quarter;
    private long count;

    public QuarterStatisticDTO(int quarter, long count) {
        this.quarter = quarter;
        this.count = count;
    }

}
