package com.codegym.auto_marketing_server.controller.admin;


import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.service.IUserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserRestController_UpdateStatus {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IUserService userService;

    @Test
    @DisplayName("Trả về 200 OK khi cập nhật status thành công")
    void updateStatus_success() throws Exception {
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setName("Nguyen Van C");
        existingUser.setStatus(false); // ban đầu INACTIVE

        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setName("Nguyen Van C");
        updatedUser.setStatus(true); // sau khi update thành ACTIVE

        // mock findById
        given(userService.findById(1L)).willReturn(Optional.of(existingUser));
        // mock save
        willDoNothing().given(userService).save(any(User.class));

        mockMvc.perform(patch("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": true}")) // boolean
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value(true)); // boolean

        verify(userService).save(any(User.class));
    }


    @Test
    @DisplayName("Trả về 404 NOT_FOUND khi user không tồn tại")
    void updateStatus_userNotFound() throws Exception {
        given(userService.findById(99L)).willReturn(Optional.empty());

        mockMvc.perform(patch("/api/users/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":true}"))
                .andExpect(status().isNotFound());
    }

}
