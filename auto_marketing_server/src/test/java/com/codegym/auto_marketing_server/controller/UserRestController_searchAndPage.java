package com.codegym.auto_marketing_server.controller;


import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.service.IUserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserRestController_searchAndPage {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IUserService userService;

    @Test
    @DisplayName("Trả về 200 OK khi tìm thấy kết quả")
    void searchAndPage_found() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setName("Nguyen Van A");

        Pageable pageable = PageRequest.of(0, 5);
        Page<User> pageResult = new PageImpl<>(Collections.singletonList(user), pageable, 1);

        given(userService.searchAndPage(
                anyString(), anyString(), any(LocalDate.class), any(LocalDate.class),any(Boolean.class), any(Pageable.class)
        )).willReturn(pageResult);

        mockMvc.perform(get("/api/users") // URL phải trùng với @RequestMapping ở controller
                        .param("name", "Nguyen")
                        .param("planName", "Premium")
                        .param("startDate", "2025-01-01")
                        .param("endDate", "2025-12-31")
                        .param("status","false")
                        .param("page", "0")
                        .param("size", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Nguyen Van A"));
    }

    @Test
    @DisplayName("Trả về 204 NO_CONTENT khi không tìm thấy kết quả")
    public  void searchAndPage() throws Exception {
        Pageable pageable = PageRequest.of(0, 5);
        Page<User> emptyPage = Page.empty(pageable);

        given(userService.searchAndPage(
                any(), any(), any(),any(), any(), any(Pageable.class)
        )).willReturn(emptyPage);

        mockMvc.perform(get("/api/users")
                        .param("page", "0")
                        .param("size", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }
}
