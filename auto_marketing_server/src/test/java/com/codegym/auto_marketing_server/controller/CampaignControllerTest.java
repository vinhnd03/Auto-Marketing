package com.codegym.auto_marketing_server.controller;
import static org.hamcrest.Matchers.containsString;
import com.codegym.auto_marketing_server.entity.Campaign;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.enums.CampaignStatus;
import com.codegym.auto_marketing_server.helper.ExcelHelper;
import com.codegym.auto_marketing_server.service.ICampaignService;
import com.codegym.auto_marketing_server.service.IWorkspaceService;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(CampaignController.class)
@AutoConfigureMockMvc(addFilters = false)
public class CampaignControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ICampaignService campaignService;

    @MockitoBean
    private IWorkspaceService workspaceService;

    @MockitoBean
    private ExcelHelper excelHelper;

    @Test
    void getStatuses_shouldReturnAllEnums() throws Exception {
        mockMvc.perform(get("/campaign/statuses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value(CampaignStatus.DRAFT.name()));
    }




    @Test
    void findAll_shouldReturnNoContentWhenEmpty() throws Exception {
        Page<Campaign> emptyPage = Page.empty(PageRequest.of(0, 10));
        when(campaignService.findAll("", null, null,1L, PageRequest.of(0, 10)))
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
        when(campaignService.findAll("", null, null,1L, PageRequest.of(0, 10)))
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
        // Mock workspace tồn tại
        Workspace mockWorkspace = new Workspace();
        mockWorkspace.setId(1L);
        mockWorkspace.setName("Workspace A");

        when(workspaceService.getWorkspaceById(1L)).thenReturn(Optional.of(mockWorkspace));

        // Mock campaignService.save
        Campaign saved = new Campaign();
        saved.setId(1L);
        saved.setName("Campaign A");
        saved.setWorkspace(mockWorkspace);

        when(campaignService.save(any(Campaign.class))).thenReturn(saved);

        // JSON hợp lệ (có đủ trường validation)
        String json = """
            {
                "name": "Campaign A",
                "description": "Some description",
                "workspaceId": 1,
                "startDate": "2025-08-18",
                "endDate": "2025-08-19",
                "status": "DRAFT"
            }
            """;

        mockMvc.perform(post("/campaign")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Campaign A"))
                .andExpect(jsonPath("$.workspace.id").value(1));
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




    @Test
    void uploadExcel_shouldReturnBadRequest_whenFileNotExcel() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.txt", "text/plain", "fake".getBytes()
        );

        mockMvc.perform(multipart("/campaign/upload-excel")
                        .file(file)
                        .param("workspaceId", "1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("File không hợp lệ")));
    }

    @Test
    void uploadExcel_shouldReturnBadRequest_whenExcelValidationError() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "fake".getBytes()
        );

        when(workspaceService.getWorkspaceById(1L))
                .thenReturn(Optional.of(new Workspace()));

        // Giả lập ExcelHelper ném exception
        try (MockedStatic<ExcelHelper> utilities = Mockito.mockStatic(ExcelHelper.class)) {
            utilities.when(() -> ExcelHelper.isExcelFile(file)).thenReturn(true);
            utilities.when(() -> ExcelHelper.excelToCampaigns(any())).thenThrow(
                    new ExcelHelper.ExcelValidationException("Sai dữ liệu")
            );

            mockMvc.perform(multipart("/campaign/upload-excel")
                            .file(file)
                            .param("workspaceId", "1"))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Sai dữ liệu")));
        }
    }

    @Test
    void uploadExcel_shouldReturnBadRequestWhenFileIsInvalid() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.txt", "text/plain", "invalid content".getBytes());

        mockMvc.perform(multipart("/campaign/upload-excel")
                        .file(file)
                        .param("workspaceId", "1"))
                .andExpect(status().isBadRequest());
    }


    @Test
    void uploadExcel_shouldReturnInternalServerError_whenWorkspaceNotFound() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "fake".getBytes()
        );

        when(workspaceService.getWorkspaceById(1L)).thenReturn(Optional.empty());

        try (MockedStatic<ExcelHelper> utilities = Mockito.mockStatic(ExcelHelper.class)) {
            utilities.when(() -> ExcelHelper.isExcelFile(file)).thenReturn(true);
            utilities.when(() -> ExcelHelper.excelToCampaigns(any())).thenReturn(Collections.emptyList());

            mockMvc.perform(multipart("/campaign/upload-excel")
                            .file(file)
                            .param("workspaceId", "1"))
                    .andExpect(status().is5xxServerError());
        }
    }
}
