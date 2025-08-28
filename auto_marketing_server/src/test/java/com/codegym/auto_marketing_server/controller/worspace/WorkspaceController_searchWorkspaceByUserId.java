package com.codegym.auto_marketing_server.controller.worspace;

import com.codegym.auto_marketing_server.controller.workspace.WorkspaceController;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.service.IWorkspaceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class WorkspaceController_searchWorkspaceByUserId {

    @Mock
    private IWorkspaceService workspaceService;

    @InjectMocks
    private WorkspaceController workspaceController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Case 1: userId = null → bad request
     */
    @Test
    void searchWorkspaceByUserId_caseNullId() {
        ResponseEntity<?> response = workspaceController.searchWorkspaceByUserId(null);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User ID không hợp lệ", response.getBody());
    }

    /**
     * Case 2: userId không tồn tại trong DB → trả về list rỗng
     */
    @Test
    void searchWorkspaceByUserId_caseNotFound() {
        Long userId = 999L;
        when(workspaceService.searchWorkspaceByUserId(userId)).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = workspaceController.searchWorkspaceByUserId(userId);

        assertEquals(201, response.getStatusCodeValue());
        List<?> result = (List<?>) response.getBody();
        assertEquals(0, result.size());
    }

    /**
     * Case 3: userId tồn tại và có 1 workspace
     */
    @Test
    void searchWorkspaceByUserId_caseFoundOne() {
        Long userId = 1L;
        Workspace workspace = new Workspace();
        workspace.setId(1L);
        workspace.setName("Test Workspace");

        when(workspaceService.searchWorkspaceByUserId(userId)).thenReturn(List.of(workspace));

        ResponseEntity<?> response = workspaceController.searchWorkspaceByUserId(userId);

        assertEquals(200, response.getStatusCodeValue());
        List<?> result = (List<?>) response.getBody();
        assertEquals(1, result.size());

        Workspace found = (Workspace) result.get(0);
        assertEquals(1L, found.getId());
        assertEquals("Test Workspace", found.getName());
    }

    /**
     * Case 4: userId tồn tại và có nhiều workspace
     */
    @Test
    void searchWorkspaceByUserId_caseFoundMultiple() {
        Long userId = 2L;
        Workspace ws1 = new Workspace();
        ws1.setId(1L);
        ws1.setName("Workspace 1");

        Workspace ws2 = new Workspace();
        ws2.setId(2L);
        ws2.setName("Workspace 2");

        when(workspaceService.searchWorkspaceByUserId(userId)).thenReturn(List.of(ws1, ws2));

        ResponseEntity<?> response = workspaceController.searchWorkspaceByUserId(userId);

        assertEquals(200, response.getStatusCodeValue());
        List<?> result = (List<?>) response.getBody();
        assertEquals(2, result.size());
    }
}
