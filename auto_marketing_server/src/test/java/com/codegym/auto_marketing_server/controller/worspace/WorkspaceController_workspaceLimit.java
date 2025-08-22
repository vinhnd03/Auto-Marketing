package com.codegym.auto_marketing_server.controller.worspace;

import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@SpringBootTest
@AutoConfigureMockMvc
public class WorkspaceController_workspaceLimit {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ISubscriptionService subscriptionService;


    @Test
    public void workspaceLimit_1() throws Exception {
        mockMvc.perform(get("/api/v1/workspaces/{id}/workspace-limit", (Object) null))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void workspaceLimit_2() throws Exception {
        Long id = 1L;
        Mockito.when(subscriptionService.findActiveByUserId(id))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/workspaces/{id}/workspace-limit", id))
                .andExpect(status().isOk())
                .andExpect(content().string("Bạn chưa mua gói dịch vụ hoặc gói của bạn đã hết hạn"));
    }

    @Test
    public void workspaceLimit_3() throws Exception {
        Long id = 1L;
        Subscription sub = new Subscription();
        sub.setId(10L);

        Mockito.when(subscriptionService.findActiveByUserId(id))
                .thenReturn(Optional.of(sub));
        Mockito.when(subscriptionService.findMaxWorkspaceByCurrenSubscription(sub.getId()))
                .thenReturn(5);

        mockMvc.perform(get("/api/v1/workspaces/{id}/workspace-limit", id))
                .andExpect(status().isOk())
                .andExpect(content().string("5"));
    }
}
