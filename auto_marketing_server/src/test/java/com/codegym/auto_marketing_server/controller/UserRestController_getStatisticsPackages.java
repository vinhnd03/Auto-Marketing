package com.codegym.auto_marketing_server.controller;


import com.codegym.auto_marketing_server.dto.StatisticResponse;
import com.codegym.auto_marketing_server.service.IUserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserRestController_getStatisticsPackages {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IUserService userService;

    @Test
    @DisplayName("Trả về 200 OK khi gọi API statistics_packages chỉ với year")
    void getStatisticsPackages_withYear() throws Exception {
        StatisticResponse response = new StatisticResponse();
        response.setMonthly(Collections.emptyList());
        response.setQuarterly(Collections.emptyList());

        given(userService.getStatisticPackagesByMonth(2025)).willReturn(Collections.emptyList());
        given(userService.getStatisticPackagesByQuarter(2025)).willReturn(Collections.emptyList());

        mockMvc.perform(get("/api/users/statistics_packages")
                        .param("year", "2025")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.monthly").isArray())
                .andExpect(jsonPath("$.quarterly").isArray())
                .andExpect(jsonPath("$.weekly").doesNotExist());
    }

    @Test
    @DisplayName("Trả về 200 OK khi gọi API statistics_packages với year và month")
    void getStatisticsPackages_withYearAndMonth() throws Exception {
        StatisticResponse response = new StatisticResponse();
        response.setMonthly(Collections.emptyList());
        response.setQuarterly(Collections.emptyList());
        response.setWeekly(Collections.emptyList());

        given(userService.getStatisticPackagesByMonth(2025)).willReturn(Collections.emptyList());
        given(userService.getStatisticPackagesByQuarter(2025)).willReturn(Collections.emptyList());
        given(userService.getStatisticPackagesByWeek(2025, 8)).willReturn(Collections.emptyList());

        mockMvc.perform(get("/api/users/statistics_packages")
                        .param("year", "2025")
                        .param("month", "8")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.monthly").isArray())
                .andExpect(jsonPath("$.quarterly").isArray())
                .andExpect(jsonPath("$.weekly").isArray());
    }
}
