package com.codegym.auto_marketing_server.controller.worspace;

import com.codegym.auto_marketing_server.dto.WorkspaceStatusUpdateDTO;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.service.IWorkspaceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.MediaType;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;


import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class WorkspaceController_updateStatus {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IWorkspaceService workspaceService;

    @Test
    public void updateStatus_19() throws Exception {
        Long id = 1L;
        mockMvc.perform(patch("/api/v1/workspaces/{id}/status", id)
                        .contentType(String.valueOf(MediaType.APPLICATION_JSON))
                        .content("")) // null
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void updateStatus_21() throws Exception {
        Long id = 1L;
        WorkspaceStatusUpdateDTO dto = new WorkspaceStatusUpdateDTO();
        dto.setIds(null);

        mockMvc.perform(patch("/api/v1/workspaces/{id}/status", id)
                        .contentType(String.valueOf(MediaType.APPLICATION_JSON))
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().is4xxClientError()); // controller catch Exception -> 500
    }

    @Test
    public void updateStatus_24() throws Exception {
        Long id = 2L;
        WorkspaceStatusUpdateDTO dto = new WorkspaceStatusUpdateDTO();
        dto.setIds(Arrays.asList(1L, 2L));

        // Mock workspaceService.searchWorkspaceByUserId
        Workspace ws1 = new Workspace();
        ws1.setId(1L);
        Workspace ws2 = new Workspace();
        ws2.setId(2L);
        Mockito.when(workspaceService.searchWorkspaceByUserId(id))
                .thenReturn(Arrays.asList(ws1, ws2));

        Mockito.when(workspaceService.save(Mockito.any(Workspace.class)))
                .thenReturn(ws1); // just dummy

        mockMvc.perform(patch("/api/v1/workspaces/{id}/status", id)
                        .contentType(String.valueOf(MediaType.APPLICATION_JSON))
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string("Cập nhật trạng thái thành công"));
    }
}
