package com.codegym.auto_marketing_server.controller.admin;

import com.codegym.auto_marketing_server.service.IUserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserRestController_getMonthlyDetailTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IUserService userService;

    @Test
    @DisplayName("200 OK khi truyền đúng year và month, trả về current & previous")
    void getMonthlyDetail_success() throws Exception {
        // Giả lập service
        given(userService.countByMonth(2025, 5)).willReturn(100); // tháng hiện tại
        given(userService.countByMonth(2025, 4)).willReturn(80);  // tháng trước

        mockMvc.perform(get("/api/users/statistics/monthly-detail")
                        .param("year", "2025")
                        .param("month", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.current.year").value(2025))
                .andExpect(jsonPath("$.current.month").value(5))
                .andExpect(jsonPath("$.current.count").value(100))
                .andExpect(jsonPath("$.previous.year").value(2025))
                .andExpect(jsonPath("$.previous.month").value(4))
                .andExpect(jsonPath("$.previous.count").value(80));
    }

    @Test
    @DisplayName("400 BAD_REQUEST khi month không hợp lệ (13)")
    void getMonthlyDetail_invalidMonth() throws Exception {
        mockMvc.perform(get("/api/users/statistics/monthly-detail")
                        .param("year", "2025")
                        .param("month", "13") // không hợp lệ
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("400 BAD_REQUEST khi month không phải số")
    void getMonthlyDetail_invalidMonthType() throws Exception {
        mockMvc.perform(get("/api/users/statistics/monthly-detail")
                        .param("year", "2025")
                        .param("month", "abc") // sai kiểu
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
