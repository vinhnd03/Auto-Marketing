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
class UserRestController_getUserCountTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IUserService userService;

    @Test
    @DisplayName("Trả về 200 OK và số lượng người dùng khi gọi /count")
    void getUserCount_success() throws Exception {
        // giả lập service trả về 10
        given(userService.count()).willReturn(10L);

        mockMvc.perform(get("/api/users/count")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("10"));
    }

    @Test
    @DisplayName("Trả về 500 khi service count() bị lỗi")
    void getUserCount_error() throws Exception {
        // giả lập service ném lỗi
        given(userService.count()).willThrow(new RuntimeException("Lỗi giả lập"));

        mockMvc.perform(get("/api/users/count")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }
}
