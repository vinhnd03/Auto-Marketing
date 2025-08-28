package com.codegym.auto_marketing_server.controller.worspace;

import com.codegym.auto_marketing_server.controller.workspace.WorkspaceController;
import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.SocialAccountWorkspace;
import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.service.*;
import com.codegym.auto_marketing_server.util.CloudinaryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class WorkspaceController_addWorkspace {
    @Mock
    private ISubscriptionService subscriptionService;

    @Mock
    private IWorkspaceService workspaceService;

    @Mock
    private ISocialAccountService socialAccountService;

    @Mock
    private IUserService userService;

    @Mock
    private ISocialAccountWorkplaceService socialAccountWorkplaceService;

    @Mock
    private CloudinaryService cloudinaryService;

    @InjectMocks
    private WorkspaceController workspaceController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private String DEFAULT_AVATAR = "https://haycafe.vn/wp-content/uploads/2022/10/Hinh-anh-anime-nu-buon.jpg";


    /**
     * Test case: tên workspace bị trùng
     * Kỳ vọng: trả về 409 Conflict
     */
    @Test
    void addWorkspace_caseDuplicateName() {
        String name = "Test";
        String description = "Desc";
        Long socialAccountId = 1L;

        Long userId = 1L;
        when(userService.selectUserIdBySocialAccountId(socialAccountId)).thenReturn(userId);
        when(workspaceService.existsByNameForUser(name, userId)).thenReturn(true);

        ResponseEntity<?> response = workspaceController.addWorkspace(name, description, null, socialAccountId);

        assertEquals(409, response.getStatusCodeValue());
        assertEquals("Tên workspace đã tồn tại", response.getBody());
    }

    /**
     * Test case: social account không tồn tại
     * Kỳ vọng: trả về 400 Bad Request
     */
    @Test
    void addWorkspace_caseSocialAccountNotFound() {
        String name = "Test";
        String description = "Desc";
        Long socialAccountId = 1L;

        Long userId = 1L;
        when(userService.selectUserIdBySocialAccountId(socialAccountId)).thenReturn(userId);
        when(workspaceService.existsByNameForUser(name, userId)).thenReturn(false);

        Workspace dummyWorkspace = new Workspace();
        dummyWorkspace.setId(1L);
        when(workspaceService.save(any(), eq(userId))).thenReturn(dummyWorkspace);

        // SocialAccount null
        when(socialAccountService.findById(socialAccountId)).thenReturn(null);

        ResponseEntity<?> response = workspaceController.addWorkspace(name, description, null, socialAccountId);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Không tìm thấy Social Account", response.getBody());
    }

    /**
     * Test case: tên và mô tả rỗng
     * Kỳ vọng: trả về 400 Bad Request
     */
    @Test
    void addWorkspace_caseEmptyNameOrDescription() {
        String name = "";
        String description = "";
        Long socialAccountId = 1L;

        ResponseEntity<?> response = workspaceController.addWorkspace(name, description, null, socialAccountId);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Tên workspace là bắt buộc", response.getBody());
    }

    /**
     * Test case: tên quá dài
     * Kỳ vọng: trả về 400 Bad Request
     */
    @Test
    void addWorkspace_caseNameTooLong() {
        String name = "A".repeat(60);
        String description = "Desc";
        Long socialAccountId = 1L;

        ResponseEntity<?> response = workspaceController.addWorkspace(name, description, null, socialAccountId);

        assertEquals(400, response.getStatusCodeValue());
    }

    /**
     * Test case: mô tả quá dài
     * Kỳ vọng: trả về 400 Bad Request
     */
    @Test
    void addWorkspace_caseDescriptionTooLong() {
        String name = "Test";
        String description = "A".repeat(300);
        Long socialAccountId = 1L;

        ResponseEntity<?> response = workspaceController.addWorkspace(name, description, null, socialAccountId);

        assertEquals(400, response.getStatusCodeValue());
    }

    /**
     * Test case: avatar upload quá lớn (> 5MB)
     * Kỳ vọng: trả về 400 Bad Request
     */
    @Test
    void addWorkspace_caseAvatarTooLarge() throws Exception {
        String name = "Test";
        String description = "Desc";
        Long socialAccountId = 1L;

        MultipartFile avatar = new MockMultipartFile("avatar", new byte[6 * 1024 * 1024]); // 6 MB

        ResponseEntity<?> response = workspaceController.addWorkspace(name, description, avatar, socialAccountId);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("File quá lớn. Vui lòng chọn ảnh <= 5 MB", response.getBody());
    }

    /**
     * Test case: tạo workspace thành công với avatar upload
     * Kỳ vọng: trả về 200 OK, workspace có avatar từ Cloudinary
     */
    @Test
    void addWorkspace_caseValidWithAvatar() throws Exception {
        String name = "Test";
        String description = "Desc";
        Long socialAccountId = 1L;

        MultipartFile avatar = new MockMultipartFile("avatar", "image.png", "image/png", new byte[1024]);

        Long userId = 1L;
        SocialAccount socialAccount = new SocialAccount();
        socialAccount.setId(socialAccountId);

        Workspace saved = new Workspace();
        saved.setId(10L);
        saved.setName(name);
        saved.setAvatar("http://fake.url/avatar.png");

        // Mock các service
        when(userService.selectUserIdBySocialAccountId(socialAccountId)).thenReturn(userId);
        when(workspaceService.existsByNameForUser(name, userId)).thenReturn(false);
        when(socialAccountService.findById(socialAccountId)).thenReturn(socialAccount);
        when(cloudinaryService.uploadMultipart(avatar)).thenReturn("http://fake.url/avatar.png");
        when(workspaceService.save(any(Workspace.class), eq(userId))).thenReturn(saved);
        doNothing().when(socialAccountWorkplaceService).save(any(SocialAccountWorkspace.class));

        // Gọi controller
        ResponseEntity<?> response = workspaceController.addWorkspace(name, description, avatar, socialAccountId);

        // Kiểm tra kết quả
        assertEquals(200, response.getStatusCode().value());
        Workspace result = (Workspace) response.getBody();
        assertEquals(10L, result.getId());
        assertEquals(name, result.getName());
        assertEquals("http://fake.url/avatar.png", result.getAvatar());
    }

    /**
     * Test case: tạo workspace thành công không có avatar
     * Kỳ vọng: trả về 200 OK, workspace có avatar mặc định
     */
    @Test
    void addWorkspace_caseValidWithoutAvatar() {
        String name = "Test";
        String description = "Desc";
        Long socialAccountId = 1L;
        Long userId = 1L;

        SocialAccount socialAccount = new SocialAccount();
        socialAccount.setId(socialAccountId);

        Workspace saved = new Workspace();
        saved.setId(11L);
        saved.setName(name);
        saved.setAvatar(DEFAULT_AVATAR); // avatar ban đầu null → @PrePersist set default

        when(userService.selectUserIdBySocialAccountId(socialAccountId)).thenReturn(userId);
        when(workspaceService.existsByNameForUser(name, userId)).thenReturn(false);
        when(socialAccountService.findById(socialAccountId)).thenReturn(socialAccount);
        when(workspaceService.save(any(Workspace.class), eq(userId))).thenReturn(saved);
        doNothing().when(socialAccountWorkplaceService).save(any(SocialAccountWorkspace.class));

        ResponseEntity<?> response = workspaceController.addWorkspace(name, description, null, socialAccountId);

        assertEquals(200, response.getStatusCodeValue());
        Workspace result = (Workspace) response.getBody();
        assertEquals(11L, result.getId());
        assertEquals(name, result.getName());
        assertEquals(DEFAULT_AVATAR, result.getAvatar()); // so sánh với biến hằng
    }

    /**
     * Test case: không có subscription (user chưa mua gói / gói đã hết hạn)
     * Kỳ vọng: trả về 400 Bad Request
     */
    @Test
    void addWorkspace_caseNoSubscription() {
        String name = "Test";
        String description = "Desc";
        Long socialAccountId = 1L;

        Long userId = 1L;

        when(userService.selectUserIdBySocialAccountId(socialAccountId)).thenReturn(userId);
        when(workspaceService.existsByNameForUser(name, userId)).thenReturn(false);
        when(workspaceService.save(any(Workspace.class), eq(userId))).thenReturn(null);
        when(subscriptionService.findActiveByUserId(userId)).thenReturn(java.util.Optional.empty());

        ResponseEntity<?> response = workspaceController.addWorkspace(name, description, null, socialAccountId);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Bạn chưa mua gói dịch vụ hoặc gói của bạn đã hết hạn", response.getBody());
    }

    /**
     * Test case: đã đạt giới hạn số lượng workspace theo subscription
     * Kỳ vọng: trả về 400 Bad Request
     */
    @Test
    void addWorkspace_caseMaxWorkspaceLimitReached() {
        String name = "Test";
        String description = "Desc";
        Long socialAccountId = 1L;

        Long userId = 1L;

        when(userService.selectUserIdBySocialAccountId(socialAccountId)).thenReturn(userId);
        when(workspaceService.existsByNameForUser(name, userId)).thenReturn(false);
        when(workspaceService.save(any(Workspace.class), eq(userId))).thenReturn(null);

        Subscription sub = new Subscription();
        sub.setId(99L);
        when(subscriptionService.findActiveByUserId(userId)).thenReturn(java.util.Optional.of(sub));

        ResponseEntity<?> response = workspaceController.addWorkspace(name, description, null, socialAccountId);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Số lượng workspace của bạn đã đạt giới hạn", response.getBody());
    }
}
