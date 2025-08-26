package com.codegym.auto_marketing_server.controller.worspace;

import com.codegym.auto_marketing_server.controller.workspace.WorkspaceController;
import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.service.IUserService;
import com.codegym.auto_marketing_server.service.IWorkspaceService;
import com.codegym.auto_marketing_server.service.ISocialAccountService;
import com.codegym.auto_marketing_server.util.CloudinaryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class WorkspaceController_updateWorkspace {

    @Mock
    private IWorkspaceService workspaceService;

    @Mock
    private ISocialAccountService socialAccountService;

    @Mock
    private IUserService userService;

    @Mock
    private CloudinaryService cloudinaryService;

    @InjectMocks
    private WorkspaceController workspaceController;

    private final String DEFAULT_AVATAR =
            "https://haycafe.vn/wp-content/uploads/2022/10/Hinh-anh-anime-nu-buon.jpg";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Case 1: name rỗng → 400
     */
    @Test
    void updateWorkspace_caseEmptyName() {
        ResponseEntity<?> response = workspaceController.updateWorkspace(
                1L, "", "desc", null, 1L);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Tên workspace là bắt buộc", response.getBody());
    }

    /**
     * Case 2: socialAccount không tồn tại → 400
     */
    @Test
    void updateWorkspace_caseSocialAccountNotFound() {
        when(socialAccountService.findById(1L)).thenReturn(null);

        ResponseEntity<?> response = workspaceController.updateWorkspace(
                1L, "Name", "Desc", null, 1L);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Không tìm thấy Social Account", response.getBody());
    }

    /**
     * Case 3: workspace không tồn tại → 404
     */
    @Test
    void updateWorkspace_caseWorkspaceNotFound() {
        when(socialAccountService.findById(1L)).thenReturn(new SocialAccount());
        when(workspaceService.findById(1L)).thenReturn(null);

        ResponseEntity<?> response = workspaceController.updateWorkspace(
                1L, "Name", "Desc", null, 1L);

        assertEquals(404, response.getStatusCodeValue());
        assertEquals("Workspace không tồn tại", response.getBody());
    }

    /**
     * Case 4: tên bị trùng → 409
     */
    @Test
    void updateWorkspace_caseDuplicateName() {
        SocialAccount sa = new SocialAccount();
        sa.setId(1L);
        Workspace ws = new Workspace();
        ws.setId(1L);
        ws.setName("Old");

        when(socialAccountService.findById(1L)).thenReturn(sa);
        when(workspaceService.findById(1L)).thenReturn(ws);
        when(userService.selectUserIdBySocialAccountId(1L)).thenReturn(99L);
        when(workspaceService.existsByNameForUserExceptId("New", 99L, 1L)).thenReturn(true);

        ResponseEntity<?> response = workspaceController.updateWorkspace(
                1L, "New", "Desc", null, 1L);

        assertEquals(409, response.getStatusCodeValue());
        assertEquals("Tên workspace đã tồn tại", response.getBody());
    }

    /**
     * Case 5: avatar quá lớn → 400
     */
    @Test
    void updateWorkspace_caseAvatarTooLarge() {
        SocialAccount sa = new SocialAccount();
        Workspace ws = new Workspace();
        ws.setId(1L);

        when(socialAccountService.findById(1L)).thenReturn(sa);
        when(workspaceService.findById(1L)).thenReturn(ws);
        when(userService.selectUserIdBySocialAccountId(1L)).thenReturn(99L);
        when(workspaceService.existsByNameForUserExceptId("Name", 99L, 1L)).thenReturn(false);

        MultipartFile bigAvatar = new MockMultipartFile(
                "avatar", new byte[6 * 1024 * 1024]); // 6MB

        ResponseEntity<?> response = workspaceController.updateWorkspace(
                1L, "Name", "Desc", bigAvatar, 1L);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("File quá lớn. Vui lòng chọn ảnh <= 5 MB", response.getBody());
    }

    /**
     * Case 6: upload avatar thất bại → 500
     */
    @Test
    void updateWorkspace_caseUploadFail() throws Exception {
        SocialAccount sa = new SocialAccount();
        Workspace ws = new Workspace();
        ws.setId(1L);

        when(socialAccountService.findById(1L)).thenReturn(sa);
        when(workspaceService.findById(1L)).thenReturn(ws);
        when(userService.selectUserIdBySocialAccountId(1L)).thenReturn(99L);
        when(workspaceService.existsByNameForUserExceptId("Name", 99L, 1L)).thenReturn(false);

        MultipartFile avatar = new MockMultipartFile("avatar", "a.png", "image/png", new byte[100]);
        when(cloudinaryService.uploadMultipart(avatar)).thenThrow(new IOException("Lỗi kết nối"));

        ResponseEntity<?> response = workspaceController.updateWorkspace(
                1L, "Name", "Desc", avatar, 1L);

        assertEquals(500, response.getStatusCodeValue());
        assertEquals("Upload ảnh thất bại: Lỗi kết nối", response.getBody());
    }

    /**
     * Case 7: update thành công có avatar mới
     */
    @Test
    void updateWorkspace_caseSuccessWithAvatar() throws Exception {
        SocialAccount sa = new SocialAccount();
        Workspace ws = new Workspace();
        ws.setId(1L);
        ws.setAvatar("old.png");

        when(socialAccountService.findById(1L)).thenReturn(sa);
        when(workspaceService.findById(1L)).thenReturn(ws);
        when(userService.selectUserIdBySocialAccountId(1L)).thenReturn(99L);
        when(workspaceService.existsByNameForUserExceptId("Name", 99L, 1L)).thenReturn(false);

        MultipartFile avatar = new MockMultipartFile("avatar", "a.png", "image/png", new byte[100]);
        when(cloudinaryService.uploadMultipart(avatar)).thenReturn("http://new.avatar");

        Workspace saved = new Workspace();
        saved.setId(1L);
        saved.setName("Name");
        saved.setDescription("Desc");
        saved.setAvatar("http://new.avatar");

        when(workspaceService.save(any())).thenReturn(saved);

        ResponseEntity<?> response = workspaceController.updateWorkspace(
                1L, "Name", "Desc", avatar, 1L);

        assertEquals(200, response.getStatusCodeValue());
        Workspace result = (Workspace) response.getBody();
        assertEquals("http://new.avatar", result.getAvatar());
        assertEquals("Name", result.getName());
    }

    /**
     * Case 8: update thành công khi avatar = null (reset về default)
     */
    @Test
    void updateWorkspace_caseSuccessRemoveAvatar() {
        SocialAccount sa = new SocialAccount();
        Workspace ws = new Workspace();
        ws.setId(1L);
        ws.setAvatar("old.png");

        when(socialAccountService.findById(1L)).thenReturn(sa);
        when(workspaceService.findById(1L)).thenReturn(ws);
        when(userService.selectUserIdBySocialAccountId(1L)).thenReturn(99L);
        when(workspaceService.existsByNameForUserExceptId("Name", 99L, 1L)).thenReturn(false);

        Workspace saved = new Workspace();
        saved.setId(1L);
        saved.setName("Name");
        saved.setDescription("Desc");
        saved.setAvatar(DEFAULT_AVATAR);

        when(workspaceService.save(any())).thenReturn(saved);

        ResponseEntity<?> response = workspaceController.updateWorkspace(
                1L, "Name", "Desc", null, 1L);

        assertEquals(200, response.getStatusCodeValue());
        Workspace result = (Workspace) response.getBody();
        assertEquals(DEFAULT_AVATAR, result.getAvatar());
    }
}
