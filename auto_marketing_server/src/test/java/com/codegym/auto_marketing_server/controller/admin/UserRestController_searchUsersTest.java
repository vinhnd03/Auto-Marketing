package com.codegym.auto_marketing_server.controller.admin;

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

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserRestController_searchUsersTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IUserService userService;

    @Test
    @DisplayName("200 OK khi có dữ liệu")
    void searchUsers_found() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setName("Tran Van B");

        Pageable pageable = PageRequest.of(0, 5);
        Page<User> pageResult = new PageImpl<>(Collections.singletonList(user), pageable, 1);

        given(userService.filterUsersBySubscription(anyString(), any(Pageable.class)))
                .willReturn(pageResult);

        mockMvc.perform(get("/api/users/search")
                        .param("subscriptionFilter", "ACTIVE")
                        .param("page", "0")
                        .param("size", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Tran Van B"));
    }

    @Test
    @DisplayName("200 OK nhưng trả về danh sách rỗng")
    void searchUsers_empty() throws Exception {
        Pageable pageable = PageRequest.of(0, 5);
        Page<User> emptyPage = Page.empty(pageable);

        given(userService.filterUsersBySubscription(anyString(), any(Pageable.class)))
                .willReturn(emptyPage);

        mockMvc.perform(get("/api/users/search")
                        .param("subscriptionFilter", "NO_PACKAGE")
                        .param("page", "0")
                        .param("size", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty());
    }

    @Test
    @DisplayName("400 Bad Request khi page không hợp lệ")
    void searchUsers_invalidPage() throws Exception {
        mockMvc.perform(get("/api/users/search")
                        .param("subscriptionFilter", "ACTIVE")
                        .param("page", "abc")   // sai kiểu int
                        .param("size", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("400 Bad Request khi size không hợp lệ")
    void searchUsers_invalidSize() throws Exception {
        mockMvc.perform(get("/api/users/search")
                        .param("subscriptionFilter", "ACTIVE")
                        .param("page", "0")
                        .param("size", "xyz")   // sai kiểu int
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}

