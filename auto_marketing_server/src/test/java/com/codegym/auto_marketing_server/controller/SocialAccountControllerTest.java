package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.service.impl.SocialAccountService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SocialAccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SocialAccountService socialAccountService;

    // Tạo config riêng cho test, thay thế @MockBean
    @TestConfiguration
    static class TestConfig {
        @Bean
        public SocialAccountService socialAccountService() {
            return Mockito.mock(SocialAccountService.class);
        }
    }

    @Test
    void testCheckLinked_WhenLinked() throws Exception {
        Long userId = 1L;
        when(socialAccountService.isLinked(userId)).thenReturn(true);

        mockMvc.perform(get("/api/social/check")
                        .param("userId", String.valueOf(userId)))
                .andExpect(status().isOk());
    }

    @Test
    void testCheckLinked_WhenNotLinked() throws Exception {
        Long userId = 2L;
        when(socialAccountService.isLinked(userId)).thenReturn(false);

        mockMvc.perform(get("/api/social/check")
                        .param("userId", String.valueOf(userId)))
                .andExpect(status().isOk()); // tuỳ bạn muốn 200 hay 404
    }
}
