package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.PackageStatsResponseDTO;
import com.codegym.auto_marketing_server.service.ITransactionService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PackageController.class) // Hoặc controller thực tế
class PackageControllerTest_getPackageStats {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ITransactionService transactionService;

    private final String baseUrl = "/api/admin/packages/stats";

    //  Happy case
    @Test
    void getPackageStats_happyCase() throws Exception {
        PackageStatsResponseDTO dto = new PackageStatsResponseDTO(100, "Pro Package", "Basic Package", 12.5);

        given(transactionService.getPackageStats()).willReturn(dto);

        mockMvc.perform(get(baseUrl)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSold").value(100))
                .andExpect(jsonPath("$.mostPopularPackage").value("Pro Package"))
                .andExpect(jsonPath("$.leastPopularPackage").value("Basic Package"))
                .andExpect(jsonPath("$.growthRate").value(12.5));
    }

    //  Service trả null
    @Test
    void getPackageStats_nullResponse() throws Exception {
        given(transactionService.getPackageStats()).willReturn(null);

        mockMvc.perform(get(baseUrl)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("")); // body rỗng
    }

    // Service ném exception
    @Test
    void getPackageStats_serviceException() throws Exception {
        when(transactionService.getPackageStats()).thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(get(baseUrl)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }
}
