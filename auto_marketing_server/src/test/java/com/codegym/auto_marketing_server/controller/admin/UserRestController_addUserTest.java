package com.codegym.auto_marketing_server.controller.admin;

import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.service.IUserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserRestController_addUserTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IUserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("201 CREATED khi thêm user hợp lệ")
    void addUser_valid() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setName("Nguyen Van B");

        // Mock service không làm gì
        willDoNothing().given(userService).save(any(User.class));

        mockMvc.perform(post("/api/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("400 BAD_REQUEST khi JSON không hợp lệ")
    void addUser_invalidJson() throws Exception {
        // Gửi JSON lỗi cú pháp
        String invalidJson = "{ \"id\": 1, \"name\": }"; // thiếu value cho name

        mockMvc.perform(post("/api/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }
}
