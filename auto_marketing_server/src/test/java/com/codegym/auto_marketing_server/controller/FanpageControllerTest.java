package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.controller.publish.FanpageController;
import com.codegym.auto_marketing_server.entity.Fanpage;
import com.codegym.auto_marketing_server.service.impl.FanpageService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FanpageController.class)
class FanpageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FanpageService fanpageService;

    @Test
    void syncFanpages_success() throws Exception {
        Fanpage page = new Fanpage();
        page.setId(1L);
        Mockito.when(fanpageService.syncUserPages(10L)).thenReturn(List.of(page));

        mockMvc.perform(post("/api/fanpages/sync?userId=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void listFanpages_success() throws Exception {
        Fanpage page = new Fanpage();
        page.setId(2L);
        Mockito.when(fanpageService.listByUser(20L)).thenReturn(List.of(page));

        mockMvc.perform(get("/api/fanpages?userId=20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(2L));
    }
}
