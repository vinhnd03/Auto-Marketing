package com.codegym.auto_marketing_server.controller.worspace;

import com.codegym.auto_marketing_server.dto.WorkspaceRequestDTO;
import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.bean.override.mockito.MockitoBeans;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class WorkspaceController_updateWorkspace {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private IWorkspaceService workspaceService;

    @MockitoBean
    private ISocialAccountService socialAccountService;

    @Test
    public void updateWorkspace_1() throws Exception {
        Long id = 1L;
        mockMvc.perform(patch("/api/v1/workspaces/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("")) // null body
                .andExpect(status().isBadRequest());
    }

    @Test
    public void updateWorkspace_2() throws Exception {
        Long id = 1L;
        WorkspaceRequestDTO dto = new WorkspaceRequestDTO();
        dto.setName("");
        dto.setDescription("abc");
        dto.setSocialAccountId(1L);

        mockMvc.perform(patch("/api/v1/workspaces/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void updateWorkspace_3() throws Exception {
        Long id = 1L;
        WorkspaceRequestDTO dto = new WorkspaceRequestDTO();
        dto.setName("A".repeat(60));
        dto.setDescription("desc");
        dto.setSocialAccountId(1L);

        mockMvc.perform(patch("/api/v1/workspaces/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void updateWorkspace_4() throws Exception {
        Long id = 1L;
        WorkspaceRequestDTO dto = new WorkspaceRequestDTO();
        dto.setName("Valid");
        dto.setDescription("desc");
        dto.setSocialAccountId(1L);

        Mockito.when(socialAccountService.findById(dto.getSocialAccountId()))
                .thenReturn(null);

        mockMvc.perform(patch("/api/v1/workspaces/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Không tìm thấy Social Account"));
    }

    @Test
    public void updateWorkspace_5() throws Exception {
        Long id = 1L;
        WorkspaceRequestDTO dto = new WorkspaceRequestDTO();
        dto.setName("Valid");
        dto.setDescription("desc");
        dto.setSocialAccountId(1L);

        SocialAccount socialAccount = new SocialAccount();
        socialAccount.setId(1L);

        Workspace saved = new Workspace();
        saved.setId(id);
        saved.setName("Valid");

        Mockito.when(socialAccountService.findById(dto.getSocialAccountId()))
                .thenReturn(socialAccount);

        Mockito.when(workspaceService.save(Mockito.any(Workspace.class)))
                .thenReturn(saved);

        mockMvc.perform(patch("/api/v1/workspaces/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Valid"));
    }
}
