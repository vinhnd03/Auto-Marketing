package com.codegym.auto_marketing_server.controller.worspace;

import com.codegym.auto_marketing_server.dto.WorkspaceRequestDTO;
import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.SocialAccountWorkspace;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class WorkspaceController_addWorkspace {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private IWorkspaceService workspaceService;

    @MockitoBean
    private ISocialAccountService socialAccountService;

    @MockitoBean
    private IUserService userService;

    @MockitoBean
    private ISocialAccountWorkplaceService socialAccountWorkplaceService;


    // Case 13: DTO null
    @Test
    void addWorkspace_case13() throws Exception {
        mockMvc.perform(post("/api/v1/workspaces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("")) // rỗng coi như null
                .andExpect(status().isBadRequest());
    }

    // Case 14: name = "", description valid
    @Test
    void addWorkspace_case14() throws Exception {
        WorkspaceRequestDTO dto = new WorkspaceRequestDTO();
        dto.setName("");
        dto.setDescription("Test");
        dto.setSocialAccountId(1L);

        mockMvc.perform(post("/api/v1/workspaces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    // Case 15: description rỗng => 400
    @Test
    void addWorkspace_case15() throws Exception {
        WorkspaceRequestDTO dto = new WorkspaceRequestDTO();
        dto.setName("Hello");
        dto.setDescription("");
        dto.setSocialAccountId(1L);

        mockMvc.perform(post("/api/v1/workspaces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    // Case 16: name quá dài > 50 ký tự
    @Test
    void addWorkspace_case16() throws Exception {
        WorkspaceRequestDTO dto = new WorkspaceRequestDTO();
        dto.setName("A".repeat(60));
        dto.setDescription("desc");
        dto.setSocialAccountId(1L);

        mockMvc.perform(post("/api/v1/workspaces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    // Case 17: description quá dài > 255
    @Test
    void addWorkspace_case17_DescriptionTooLong() throws Exception {
        WorkspaceRequestDTO dto = new WorkspaceRequestDTO();
        dto.setName("Workspace1");
        dto.setDescription("A".repeat(300));
        dto.setSocialAccountId(1L);

        mockMvc.perform(post("/api/v1/workspaces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }


    @Test
    void addWorkspace_caseDuplicateName() throws Exception {
        WorkspaceRequestDTO dto = new WorkspaceRequestDTO();
        dto.setName("Test");
        dto.setDescription("Test desc");
        dto.setSocialAccountId(1L);

        Long userId = 1L;
        Mockito.when(userService.selectUserIdBySocialAccountId(dto.getSocialAccountId()))
                .thenReturn(userId);
        Mockito.when(workspaceService.existsByNameForUser(dto.getName(), userId))
                .thenReturn(true);

        mockMvc.perform(post("/api/v1/workspaces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isConflict())
                .andExpect(content().string("Tên workspace đã tồn tại"));
    }


    @Test
    void addWorkspace_caseSocialAccountNotFound() throws Exception {
        WorkspaceRequestDTO dto = new WorkspaceRequestDTO();
        dto.setName("Test");
        dto.setDescription("Test desc");
        dto.setSocialAccountId(1L);

        Long userId = 1L;
        Mockito.when(userService.selectUserIdBySocialAccountId(dto.getSocialAccountId()))
                .thenReturn(userId);
        Mockito.when(workspaceService.existsByNameForUser(dto.getName(), userId))
                .thenReturn(false);
        Mockito.when(socialAccountService.findById(dto.getSocialAccountId()))
                .thenReturn(null);

        mockMvc.perform(post("/api/v1/workspaces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Không tìm thấy Social Account"));
    }


    @Test
    void addWorkspace_caseValid() throws Exception {
        WorkspaceRequestDTO dto = new WorkspaceRequestDTO();
        dto.setName("Test");
        dto.setDescription("Test desc");
        dto.setSocialAccountId(1L);

        Long userId = 1L;
        SocialAccount socialAccount = new SocialAccount();
        socialAccount.setId(1L);

        Workspace saved = new Workspace();
        saved.setId(10L);
        saved.setName("Test");

        Mockito.when(userService.selectUserIdBySocialAccountId(dto.getSocialAccountId()))
                .thenReturn(userId);
        Mockito.when(workspaceService.existsByNameForUser(dto.getName(), userId))
                .thenReturn(false);
        Mockito.when(socialAccountService.findById(dto.getSocialAccountId()))
                .thenReturn(socialAccount);
        Mockito.when(workspaceService.save(Mockito.any(Workspace.class), Mockito.eq(userId)))
                .thenReturn(saved);


        Mockito.doNothing().when(socialAccountWorkplaceService).save(Mockito.any(SocialAccountWorkspace.class));

        mockMvc.perform(post("/api/v1/workspaces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.name").value("Test"));
    }
}
