package com.codegym.auto_marketing_server.controller.worspace;

import com.codegym.auto_marketing_server.controller.workspace.WorkspaceController;
import com.codegym.auto_marketing_server.dto.WorkspaceStatusUpdateDTO;
import com.codegym.auto_marketing_server.service.IWorkspaceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class WorkspaceController_updateStatus {

    @Mock
    private IWorkspaceService workspaceService;

    @InjectMocks
    private WorkspaceController workspaceController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Case 1: dto null → 400
     */
    @Test
    void updateStatus_caseNullDto() {
        Long userId = 1L;

        ResponseEntity<?> response = workspaceController.updateWorkspaceStatus(userId, null);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Danh sách Id không hợp lệ", response.getBody());
    }

    /**
     * Case 2: ids null → 400
     */
    @Test
    void updateStatus_caseNullIds() {
        Long userId = 1L;
        WorkspaceStatusUpdateDTO dto = new WorkspaceStatusUpdateDTO();
        dto.setIds(null);

        ResponseEntity<?> response = workspaceController.updateWorkspaceStatus(userId, dto);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Danh sách Id không hợp lệ", response.getBody());
    }

    /**
     * Case 3: ids empty → 400
     */
    @Test
    void updateStatus_caseEmptyIds() {
        Long userId = 1L;
        WorkspaceStatusUpdateDTO dto = new WorkspaceStatusUpdateDTO();
        dto.setIds(Collections.emptyList());

        ResponseEntity<?> response = workspaceController.updateWorkspaceStatus(userId, dto);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Danh sách Id không hợp lệ", response.getBody());
    }

    /**
     * Case 4: update thành công
     */
    @Test
    void updateStatus_caseSuccess() {
        Long userId = 1L;
        WorkspaceStatusUpdateDTO dto = new WorkspaceStatusUpdateDTO();
        dto.setIds(Arrays.asList(1L, 2L));

        ResponseEntity<?> response = workspaceController.updateWorkspaceStatus(userId, dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Cập nhật trạng thái thành công", response.getBody());

        verify(workspaceService, times(1)).updateWorkspaceStatusForUser(userId, dto.getIds());
    }

    /**
     * Case 5: service throw exception → 500
     */
    @Test
    void updateStatus_caseException() {
        Long userId = 1L;
        WorkspaceStatusUpdateDTO dto = new WorkspaceStatusUpdateDTO();
        dto.setIds(Arrays.asList(1L, 2L));

        doThrow(new RuntimeException("DB error"))
                .when(workspaceService).updateWorkspaceStatusForUser(userId, dto.getIds());

        ResponseEntity<?> response = workspaceController.updateWorkspaceStatus(userId, dto);

        assertEquals(500, response.getStatusCodeValue());
        assertEquals("Cập nhật thất bại: DB error", response.getBody());
    }
}
