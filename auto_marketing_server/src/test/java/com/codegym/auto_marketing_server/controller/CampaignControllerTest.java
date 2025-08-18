package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.CampaignDTO;
import com.codegym.auto_marketing_server.entity.Campaign;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.enums.CampaignStatus;
import com.codegym.auto_marketing_server.service.ICampaignService;
import com.codegym.auto_marketing_server.service.IWorkspaceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CampaignController.class)
@AutoConfigureMockMvc(addFilters = false)
public class CampaignControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ICampaignService campaignService;

    @MockitoBean
    private IWorkspaceService workspaceService;

    @Test
    void getStatuses_shouldReturnAllEnums() throws Exception {
        mockMvc.perform(get("/campaign/statuses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value(CampaignStatus.DRAFT.name()));
    }




    @Test
    void findAll_shouldReturnNoContentWhenEmpty() throws Exception {
        Page<Campaign> emptyPage = Page.empty(PageRequest.of(0, 10));
        when(campaignService.findAll("", null, null, PageRequest.of(0, 10)))
                .thenReturn(emptyPage);

        mockMvc.perform(get("/campaign"))
                .andExpect(status().isNoContent());
    }

    @Test
    void findAll_shouldReturnOkWhenHasData() throws Exception {
        Campaign campaign = new Campaign();
        campaign.setId(1L);
        campaign.setName("Test Campaign");

        Page<Campaign> page = new PageImpl<>(Collections.singletonList(campaign));
        when(campaignService.findAll("", null, null, PageRequest.of(0, 10)))
                .thenReturn(page);

        mockMvc.perform(get("/campaign"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Test Campaign"));
    }

    @Test
    void create_shouldReturnBadRequestWhenNameIsBlank() throws Exception {
        Workspace mockWorkspace = new Workspace();
        mockWorkspace.setId(1L);
        when(workspaceService.getWorkspaceById(1L)).thenReturn(Optional.of(mockWorkspace));

        String json = """
        {
            "description": "desc",
            "workspaceId": 1,
            "startDate": "2025-08-18",
            "endDate": "2025-08-19",
            "status": "DRAFT"
        }
        """;

        mockMvc.perform(post("/campaign")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name").value("Tên chiến dịch không được để trống"));
    }


    @Test
    void create_shouldReturnCreatedWhenValid() throws Exception {
        CampaignDTO dto = new CampaignDTO();
        dto.setName("Campaign A");

        Campaign saved = new Campaign();
        saved.setId(1L);
        saved.setName("Campaign A");

        when(campaignService.save(any(Campaign.class))).thenReturn(saved);

        String json = """
                {
                    "name": "Campaign A"
                }
                """;

        mockMvc.perform(post("/campaign")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Campaign A"));
    }

    @Test
    void getCampaignById_shouldReturnNotFound() throws Exception {
        when(campaignService.findById(99L)).thenReturn(null);

        mockMvc.perform(get("/campaign/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getCampaignById_shouldReturnCampaign() throws Exception {
        Campaign campaign = new Campaign();
        campaign.setId(1L);
        campaign.setName("Campaign 1");

        when(campaignService.findById(1L)).thenReturn(campaign);

        mockMvc.perform(get("/campaign/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Campaign 1"));
    }

    @Test
    void deleteCampaign_shouldReturnNotFound() throws Exception {
        when(campaignService.findById(anyLong())).thenReturn(null);

        mockMvc.perform(delete("/campaign/123"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteCampaign_shouldReturnOk() throws Exception {
        Campaign campaign = new Campaign();
        campaign.setId(1L);
        campaign.setName("Campaign X");

        when(campaignService.findById(1L)).thenReturn(campaign);
        when(campaignService.save(any(Campaign.class))).thenReturn(campaign);

        mockMvc.perform(delete("/campaign/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Đã xóa Campaign thành công"));
    }
}
