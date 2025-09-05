package com.codegym.auto_marketing_server.controller.worspace;

import com.codegym.auto_marketing_server.controller.workspace.WorkspaceController;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.service.IUserService;
import com.codegym.auto_marketing_server.service.IWorkspaceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class WorkspaceController_searchWorkspaceByUserId {

    @Mock
    private IWorkspaceService workspaceService;

    @Mock
    private IUserService userService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private WorkspaceController workspaceController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Case 1: authentication = null → trả về 401
     */
    @Test
    void searchWorkspaceByUserId_caseAuthenticationNull() {
        ResponseEntity<?> response = workspaceController.searchWorkspaceByUserId(null);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Not authenticated", response.getBody());
    }

    /**
     * Case 2: authentication không authenticated → trả về 401
     */
    @Test
    void searchWorkspaceByUserId_caseNotAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(false);

        ResponseEntity<?> response = workspaceController.searchWorkspaceByUserId(authentication);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Not authenticated", response.getBody());
    }

    /**
     * Case 3: User hợp lệ nhưng không có workspace → trả về 201 + list rỗng
     */
    @Test
    void searchWorkspaceByUserId_caseNoWorkspace() {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userService.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));
        when(workspaceService.searchWorkspaceByUserId(mockUser.getId())).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = workspaceController.searchWorkspaceByUserId(authentication);

        assertEquals(201, response.getStatusCodeValue());
        List<?> result = (List<?>) response.getBody();
        assertEquals(0, result.size());
    }

    /**
     * Case 4: User hợp lệ có 1 workspace → trả về 200 + list 1 phần tử
     */
    @Test
    void searchWorkspaceByUserId_caseOneWorkspace() {
        User mockUser = new User();
        mockUser.setId(2L);
        mockUser.setEmail("one@example.com");

        Workspace workspace = new Workspace();
        workspace.setId(10L);
        workspace.setName("Workspace One");

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userService.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));
        when(workspaceService.searchWorkspaceByUserId(mockUser.getId())).thenReturn(List.of(workspace));

        ResponseEntity<?> response = workspaceController.searchWorkspaceByUserId(authentication);

        assertEquals(200, response.getStatusCodeValue());
        List<?> result = (List<?>) response.getBody();
        assertEquals(1, result.size());

        Workspace found = (Workspace) result.get(0);
        assertEquals(10L, found.getId());
        assertEquals("Workspace One", found.getName());
    }

    /**
     * Case 5: User hợp lệ có nhiều workspace → trả về 200 + list nhiều phần tử
     */
    @Test
    void searchWorkspaceByUserId_caseMultipleWorkspace() {
        User mockUser = new User();
        mockUser.setId(3L);
        mockUser.setEmail("multi@example.com");

        Workspace ws1 = new Workspace();
        ws1.setId(1L);
        ws1.setName("Workspace 1");

        Workspace ws2 = new Workspace();
        ws2.setId(2L);
        ws2.setName("Workspace 2");

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(userService.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));
        when(workspaceService.searchWorkspaceByUserId(mockUser.getId())).thenReturn(List.of(ws1, ws2));

        ResponseEntity<?> response = workspaceController.searchWorkspaceByUserId(authentication);

        assertEquals(200, response.getStatusCodeValue());
        List<?> result = (List<?>) response.getBody();
        assertEquals(2, result.size());
    }
}
