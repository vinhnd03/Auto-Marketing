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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
public class WorkspaceController_getWorkspaceDetailTest {
    @Mock
    private IWorkspaceService workspaceService;

    @InjectMocks
    private WorkspaceController workspaceController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getWorkspaceDetail_caseNotFound() {
        // Arrange
        Long id = 99L;
        when(workspaceService.findById(id)).thenReturn(null);

        // Act
        ResponseEntity<?> response = workspaceController.getWorkspaceDetail(id);

        // Assert
        assertEquals(404, response.getStatusCodeValue());
        assertEquals("Not found", response.getBody());
    }

    @Test
    void getWorkspaceDetail_caseFound() {
        // Arrange
        Long id = 1L;
        Workspace workspace = new Workspace();
        workspace.setId(id);
        workspace.setName("My Workspace");
        when(workspaceService.findById(id)).thenReturn(workspace);

        // Act
        ResponseEntity<?> response = workspaceController.getWorkspaceDetail(id);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(workspace, response.getBody());
    }

}
