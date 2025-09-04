package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.RevenueDTO;
import com.codegym.auto_marketing_server.service.ITransactionService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RevenueController.class)
class RevenueControllerTest_getRevenue {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ITransactionService transactionService;

    private final String baseUrl = "/api/admin/revenue";

    // service trả về danh sách dữ liệu
    @Test
    void getRevenue_happyCase() throws Exception {
        LocalDateTime start = LocalDateTime.of(2025, 8, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(2025, 8, 31, 23, 59);

        RevenueDTO dto1 = new RevenueDTO("2025-08", 100.0);
        RevenueDTO dto2 = new RevenueDTO("2025-08", 50.0);
        List<RevenueDTO> revenueList = Arrays.asList(dto1, dto2);

        given(transactionService.getRevenue("month", start, end)).willReturn(revenueList);

        mockMvc.perform(get(baseUrl)
                        .param("type", "month")
                        .param("start", start.toString())
                        .param("end", end.toString())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].period").value("2025-08"))
                .andExpect(jsonPath("$[0].totalRevenue").value(100.0))
                .andExpect(jsonPath("$[1].period").value("2025-08"))
                .andExpect(jsonPath("$[1].totalRevenue").value(50.0));
    }

    //  service trả về rỗng
    @Test
    void getRevenue_emptyList() throws Exception {
        LocalDateTime start = LocalDateTime.of(2025, 8, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(2025, 8, 31, 23, 59);

        given(transactionService.getRevenue("month", start, end)).willReturn(Collections.emptyList());

        mockMvc.perform(get(baseUrl)
                        .param("type", "month")
                        .param("start", start.toString())
                        .param("end", end.toString())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    // service ném exception
    @Test
    void getRevenue_invalidType() throws Exception {
        LocalDateTime start = LocalDateTime.of(2025, 8, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(2025, 8, 31, 23, 59);

        when(transactionService.getRevenue("year", start, end))
                .thenThrow(new IllegalArgumentException("Invalid type"));

        mockMvc.perform(get(baseUrl)
                        .param("type", "year")
                        .param("start", start.toString())
                        .param("end", end.toString())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // start > end
    @Test
    void getRevenue_invalidDates() throws Exception {
        LocalDateTime start = LocalDateTime.of(2025, 8, 31, 23, 59);
        LocalDateTime end = LocalDateTime.of(2025, 8, 1, 0, 0);

        when(transactionService.getRevenue("month", start, end))
                .thenThrow(new IllegalArgumentException("Start date must be before end date"));

        mockMvc.perform(get(baseUrl)
                        .param("type", "month")
                        .param("start", start.toString())
                        .param("end", end.toString())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // start hoặc end thiếu
    @Test
    void getRevenue_missingParameters() throws Exception {
        mockMvc.perform(get(baseUrl)
                        .param("type", "month")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // bất kỳ lỗi runtime
    @Test
    void getRevenue_serviceException() throws Exception {
        LocalDateTime start = LocalDateTime.of(2025, 8, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(2025, 8, 31, 23, 59);

        when(transactionService.getRevenue("month", start, end))
                .thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(get(baseUrl)
                        .param("type", "month")
                        .param("start", start.toString())
                        .param("end", end.toString())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
