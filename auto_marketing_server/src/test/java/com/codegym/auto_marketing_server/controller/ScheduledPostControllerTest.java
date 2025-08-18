package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.controller.publish.ScheduledPostController;
import com.codegym.auto_marketing_server.dto.ScheduleRequestDTO;
import com.codegym.auto_marketing_server.entity.ScheduledPost;
import com.codegym.auto_marketing_server.service.impl.ScheduledPostService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ScheduledPostController.class)
class ScheduledPostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ScheduledPostService scheduledPostService;

    @Test
    void testCreateSchedule() throws Exception {
        ScheduledPost post = new ScheduledPost();
        post.setId(1L);

        Mockito.when(scheduledPostService.createSchedule(Mockito.any())).thenReturn(post);

        mockMvc.perform(post("/api/schedules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"Hello\",\"scheduledTime\":\"2025-08-18T12:00:00\",\"fanpageId\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void testGetPublishedPosts() throws Exception {
        ScheduledPost post = new ScheduledPost();
        post.setId(2L);
        Mockito.when(scheduledPostService.getPublishedPosts()).thenReturn(List.of(post));

        mockMvc.perform(get("/api/schedules/published"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(2L));
    }

    @Test
    void testGetScheduledPost_Found() throws Exception {
        ScheduledPost post = new ScheduledPost();
        post.setId(3L);
        Mockito.when(scheduledPostService.getById(3L)).thenReturn(Optional.of(post));

        mockMvc.perform(get("/api/schedules/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3L));
    }

    @Test
    void testGetScheduledPost_NotFound() throws Exception {
        Mockito.when(scheduledPostService.getById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/schedules/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteScheduledPost() throws Exception {
        ScheduledPost post = new ScheduledPost();
        post.setId(5L);
        Mockito.when(scheduledPostService.getById(5L)).thenReturn(Optional.of(post));

        mockMvc.perform(delete("/api/schedules/5"))
                .andExpect(status().isNoContent());
    }
}
