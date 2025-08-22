package com.codegym.auto_marketing_server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RevenueDTO {
    private String period;
    private Double totalRevenue;
}
