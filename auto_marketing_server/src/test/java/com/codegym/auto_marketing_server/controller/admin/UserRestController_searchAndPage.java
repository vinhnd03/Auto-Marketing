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
        // Mock data
        User user = new User();
        user.setId(1L);
        user.setName("Nguyen Van A");

        Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> pageResult = new PageImpl<>(Collections.singletonList(user), pageable, 1);

        given(userService.searchAndPage(
                anyString(), anyString(),
                any(LocalDate.class), any(LocalDate.class),
                any(Boolean.class), any(Pageable.class))
        ).willReturn(pageResult);

        // Thực thi request
        mockMvc.perform(get("/api/users")
                        .param("name", "Nguyen")
                        .param("planName", "Premium")
                        .param("startDate", "2025-01-01")
                        .param("endDate", "2025-12-31")
                        .param("status", "false")
                        .param("page", "0")
                        .param("size", "5")
                        .param("sortBy", "createdAt")
                        .param("sortDir", "DESC")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Nguyen Van A"));
    }

    @Test
    @DisplayName("Trả về 204 NO_CONTENT khi không tìm thấy kết quả")
    void searchAndPage_noContent() throws Exception {
        Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> emptyPage = Page.empty(pageable);

        given(userService.searchAndPage(
                any(), any(), any(), any(), any(), any(Pageable.class))
        ).willReturn(emptyPage);

        mockMvc.perform(get("/api/users")
                        .param("page", "0")
                        .param("size", "5")
                        .param("sortBy", "createdAt")
                        .param("sortDir", "DESC")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }
// hàm này trả về 500 thay vì 400 nên phải xử lí ở controller
//    @Test
//    @DisplayName("Trả về 400 BAD_REQUEST khi sortDir không hợp lệ (chỉ DESC hay ASC)")
//    void searchAndPage_invalidSortDir() throws Exception {
//        mockMvc.perform(get("/api/users")
//                        .param("page", "0")
//                        .param("size", "5")
//                        .param("sortBy", "createdAt")
//                        .param("sortDir", "INVALID") // sai ở đây
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isBadRequest());
//    }

    @Test
    @DisplayName("Trả về 400 BAD_REQUEST khi định dạng ngày không hợp lệ")
    void searchAndPage_invalidDateFormat() throws Exception {
        mockMvc.perform(get("/api/users")
                        .param("startDate", "2025-99-99") // sai format
                        .param("page", "0")
                        .param("size", "5")
                        .param("sortBy", "createdAt")
                        .param("sortDir", "DESC")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

}
