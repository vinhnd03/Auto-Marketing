package com.codegym.auto_marketing_server.controller.worspace;

import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.service.IWorkspaceService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
public class WorkspaceController_searchWorkspaceByUserId {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IWorkspaceService workspaceService;

    @Test
    public void searchWorkspaceByUserId_1() throws Exception {
        mockMvc.perform(get("/api/v1/workspaces/{id}", (Object) null))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void searchWorkspaceByUserId_2() throws Exception {
        mockMvc.perform(get("/api/v1/workspaces/"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void searchWorkspaceByUserId_3() throws Exception {
        Long id = 999L;
        Mockito.when(workspaceService.searchWorkspaceByUserId(id))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/workspaces/{id}", id))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    public void searchWorkspaceByUserId_4() throws Exception {
        Long id = 1L;

        Workspace workspace = new Workspace();
        workspace.setId(1L);
        workspace.setName("Test Workspace");

        Mockito.when(workspaceService.searchWorkspaceByUserId(id))
                .thenReturn(List.of(workspace));

        mockMvc.perform(get("/api/v1/workspaces/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("Test Workspace"));
    }
}
