package com.codegym.auto_marketing_server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RevenueStatsResponseDTO {
    public static class PeriodStat {
        public BigDecimal current;     // doanh thu kỳ hiện tại
        public BigDecimal previous;    // doanh thu kỳ trước
        public double changePercent;   // % thay đổi so với kỳ trước
        public String changeType;      // "increase" | "decrease" | "flat"
    }
    public PeriodStat week;
    public PeriodStat month;
    public PeriodStat quarter;
    public BigDecimal year;
}
