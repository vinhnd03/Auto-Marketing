package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.RevenueStatsResponseDTO;
import com.codegym.auto_marketing_server.service.ITransactionService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RevenueController.class)
class RevenueControllerTest_getDashboard {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ITransactionService transactionService;

    @Test
    void getDashboard_returnsRevenueStats() throws Exception {
        // Tạo dữ liệu giả lập cho DTO
        RevenueStatsResponseDTO.PeriodStat weekStat = new RevenueStatsResponseDTO.PeriodStat();
        weekStat.current = BigDecimal.valueOf(100);
        weekStat.previous = BigDecimal.valueOf(80);
        weekStat.changePercent = 25.0;
        weekStat.changeType = "increase";

        RevenueStatsResponseDTO.PeriodStat monthStat = new RevenueStatsResponseDTO.PeriodStat();
        monthStat.current = BigDecimal.valueOf(400);
        monthStat.previous = BigDecimal.valueOf(500);
        monthStat.changePercent = -20.0;
        monthStat.changeType = "decrease";

        RevenueStatsResponseDTO.PeriodStat quarterStat = new RevenueStatsResponseDTO.PeriodStat();
        quarterStat.current = BigDecimal.valueOf(1000);
        quarterStat.previous = BigDecimal.valueOf(1000);
        quarterStat.changePercent = 0.0;
        quarterStat.changeType = "flat";

        RevenueStatsResponseDTO dto = new RevenueStatsResponseDTO();
        dto.week = weekStat;
        dto.month = monthStat;
        dto.quarter = quarterStat;
        dto.year = BigDecimal.valueOf(5000);

        // Mock service trả về dto
        given(transactionService.getRevenueStats()).willReturn(dto);

        // Gọi API và kiểm tra JSON trả về
        mockMvc.perform(get("/api/admin/revenue/dashboard")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.week.current").value(100))
                .andExpect(jsonPath("$.week.previous").value(80))
                .andExpect(jsonPath("$.week.changePercent").value(25.0))
                .andExpect(jsonPath("$.week.changeType").value("increase"))

                .andExpect(jsonPath("$.month.current").value(400))
                .andExpect(jsonPath("$.month.previous").value(500))
                .andExpect(jsonPath("$.month.changePercent").value(-20.0))
                .andExpect(jsonPath("$.month.changeType").value("decrease"))

                .andExpect(jsonPath("$.quarter.current").value(1000))
                .andExpect(jsonPath("$.quarter.previous").value(1000))
                .andExpect(jsonPath("$.quarter.changePercent").value(0.0))
                .andExpect(jsonPath("$.quarter.changeType").value("flat"))

                .andExpect(jsonPath("$.year").value(5000));
    }

    @Test
    void getDashboard_returnsEmptyObjectWhenNull() throws Exception {
        // Mock service trả về null
        given(transactionService.getRevenueStats()).willReturn(null);

        mockMvc.perform(get("/api/admin/revenue/dashboard")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("")); // response body rỗng
    }


    @Test
    void getDashboard_returns500WhenExceptionThrown() throws Exception {
        // Mock service ném exception
        when(transactionService.getRevenueStats())
                .thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(get("/api/admin/revenue/dashboard")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }
}
