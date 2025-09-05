package com.codegym.auto_marketing_server.controller.worspace;

import com.codegym.auto_marketing_server.controller.workspace.WorkspaceController;
import com.codegym.auto_marketing_server.dto.WorkspaceStatusUpdateDTO;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.service.IUserService;
import com.codegym.auto_marketing_server.service.IWorkspaceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class WorkspaceController_updateStatus {

    @Mock
    private IWorkspaceService workspaceService;

    @Mock
    private IUserService userService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private WorkspaceController workspaceController;

    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
    }

    /**
     * Case 1: dto null → 400
     */
    @Test
    void updateStatus_caseNullDto() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);

        ResponseEntity<?> response = workspaceController.updateWorkspaceStatus(authentication, null);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Danh sách Id không hợp lệ", response.getBody());
    }

    /**
     * Case 2: ids null → 400
     */
    @Test
    void updateStatus_caseNullIds() {
        WorkspaceStatusUpdateDTO dto = new WorkspaceStatusUpdateDTO();
        dto.setIds(null);

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);

        ResponseEntity<?> response = workspaceController.updateWorkspaceStatus(authentication, dto);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Danh sách Id không hợp lệ", response.getBody());
    }

    /**
     * Case 3: ids empty → 400
     */
    @Test
    void updateStatus_caseEmptyIds() {
        WorkspaceStatusUpdateDTO dto = new WorkspaceStatusUpdateDTO();
        dto.setIds(Collections.emptyList());

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);

        ResponseEntity<?> response = workspaceController.updateWorkspaceStatus(authentication, dto);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Danh sách Id không hợp lệ", response.getBody());
    }

    /**
     * Case 4: update thành công
     */
    @Test
    void updateStatus_caseSuccess() {
        WorkspaceStatusUpdateDTO dto = new WorkspaceStatusUpdateDTO();
        dto.setIds(Arrays.asList(1L, 2L));

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userService.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

        ResponseEntity<?> response = workspaceController.updateWorkspaceStatus(authentication, dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Cập nhật trạng thái thành công", response.getBody());

        verify(workspaceService, times(1)).updateWorkspaceStatusForUser(mockUser.getId(), dto.getIds());
    }

    /**
     * Case 5: không tìm thấy user → 404
     */
    @Test
    void updateStatus_caseUserNotFound() {
        WorkspaceStatusUpdateDTO dto = new WorkspaceStatusUpdateDTO();
        dto.setIds(Arrays.asList(1L, 2L));

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userService.findByEmail(mockUser.getEmail())).thenReturn(Optional.empty());

        ResponseEntity<?> response = workspaceController.updateWorkspaceStatus(authentication, dto);

        assertEquals(404, response.getStatusCodeValue());
        assertEquals("Không tìm thấy người dùng", response.getBody());
    }

    /**
     * Case 6: service throw exception → 500
     */
    @Test
    void updateStatus_caseException() {
        WorkspaceStatusUpdateDTO dto = new WorkspaceStatusUpdateDTO();
        dto.setIds(Arrays.asList(1L, 2L));

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userService.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

        doThrow(new RuntimeException("DB error"))
                .when(workspaceService).updateWorkspaceStatusForUser(mockUser.getId(), dto.getIds());

        ResponseEntity<?> response = workspaceController.updateWorkspaceStatus(authentication, dto);

        assertEquals(500, response.getStatusCodeValue());
        assertEquals("Cập nhật thất bại: DB error", response.getBody());
    }
}
