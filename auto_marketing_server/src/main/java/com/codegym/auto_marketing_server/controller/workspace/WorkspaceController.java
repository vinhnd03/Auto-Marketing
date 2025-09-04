package com.codegym.auto_marketing_server.controller.workspace;

import com.codegym.auto_marketing_server.dto.WorkspaceStatusUpdateDTO;
import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.SocialAccountWorkspace;
import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.service.*;
import com.codegym.auto_marketing_server.service.impl.SubscriptionManagementService;
import com.codegym.auto_marketing_server.util.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {
    private final IWorkspaceService workspaceService;
    private final ISocialAccountWorkplaceService socialAccountWorkplaceService;
    private final ISocialAccountService socialAccountService;
    private final IUserService userService;
    private final ISubscriptionService subscriptionService;
    private final CloudinaryService cloudinaryService;
    private final SubscriptionManagementService subscriptionManagementService;

    @GetMapping("/user/{id}")
    public ResponseEntity<?> searchWorkspaceByUserId(@PathVariable(required = false) Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().body("User ID không hợp lệ");
        }

        List<Workspace> workspaces = workspaceService.searchWorkspaceByUserId(id);

        if (workspaces == null || workspaces.isEmpty()) {
            // trả về 201 + danh sách rỗng
            return ResponseEntity.status(201).body(Collections.emptyList());
        }

        return ResponseEntity.ok(workspaces);
    }

    @PostMapping("")
    public ResponseEntity<?> addWorkspace(
            @RequestPart("name") String name,
            @RequestPart("description") String description,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam("socialAccountId") Long socialAccountId
    ) {
        if (name == null || name.isBlank()) {
            return new ResponseEntity<>("Tên workspace là bắt buộc", HttpStatus.BAD_REQUEST);
        }

        Long userId = userService.selectUserIdBySocialAccountId(socialAccountId);

        boolean exists = workspaceService.existsByNameForUser(name, userId);
        if (exists) {
            return new ResponseEntity<>("Tên workspace đã tồn tại", HttpStatus.CONFLICT);
        }

        String avatarUrl = null;
        try {
            if (avatar != null && !avatar.isEmpty()) {
                // Giới hạn dung lượng tối đa 500KB
                long maxSize = 5000 * 1024; // 500 KB
                if (avatar.getSize() > maxSize) {
                    return new ResponseEntity<>("File quá lớn. Vui lòng chọn ảnh <= 5 MB", HttpStatus.BAD_REQUEST);
                }

                // Upload lên Cloudinary
                avatarUrl = cloudinaryService.uploadMultipart(avatar);
            }
        } catch (IOException e) {
            return new ResponseEntity<>("Upload ảnh thất bại: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("Có lỗi xảy ra khi upload ảnh: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        Workspace workspace = new Workspace();
        workspace.setName(name);
        workspace.setDescription(description);
        workspace.setAvatar(avatarUrl);

        Workspace savedWorkspace = workspaceService.save(workspace, userId);
        if (savedWorkspace != null) {
            SocialAccount socialAccount = socialAccountService.findById(socialAccountId);
            if (socialAccount == null) {
                return new ResponseEntity<>("Không tìm thấy Social Account", HttpStatus.BAD_REQUEST);
            }

            SocialAccountWorkspace link = new SocialAccountWorkspace();
            link.setWorkspace(savedWorkspace);
            link.setSocialAccount(socialAccount);
            socialAccountWorkplaceService.save(link);

            return new ResponseEntity<>(savedWorkspace, HttpStatus.OK);
        }

        Optional<Subscription> subscriptionCur = subscriptionService.findActiveByUserId(userId);
        if (subscriptionCur.isEmpty()) {
            return new ResponseEntity<>("Bạn chưa mua gói dịch vụ hoặc gói của bạn đã hết hạn", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("Số lượng workspace của bạn đã đạt giới hạn", HttpStatus.BAD_REQUEST);
    }


    @PatchMapping("/{id}")
    public ResponseEntity<?> updateWorkspace(
            @PathVariable Long id,
            @RequestPart("name") String name,
            @RequestPart("description") String description,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam("socialAccountId") Long socialAccountId
    ) {
        // Validate
        if (name == null || name.isBlank()) {
            return new ResponseEntity<>("Tên workspace là bắt buộc", HttpStatus.BAD_REQUEST);
        }

        // Kiểm tra người dùng / SocialAccount
        SocialAccount socialAccount = socialAccountService.findById(socialAccountId);
        if (socialAccount == null) {
            return new ResponseEntity<>("Không tìm thấy Social Account", HttpStatus.BAD_REQUEST);
        }

        Workspace existing = workspaceService.findById(id);
        if (existing == null) {
            return new ResponseEntity<>("Workspace không tồn tại", HttpStatus.NOT_FOUND);
        }

        // Nếu người dùng nhập tên mới thì check trùng
        Long userId = userService.selectUserIdBySocialAccountId(socialAccountId);
        boolean existsOther = workspaceService.existsByNameForUserExceptId(name, userId, id);
        if (existsOther) {
            return new ResponseEntity<>("Tên workspace đã tồn tại", HttpStatus.CONFLICT);
        }

        String avatarUrl = existing.getAvatar(); // giữ avatar cũ

        try {
            if (avatar != null && !avatar.isEmpty()) {
                // Giới hạn dung lượng 5 MB
                long maxSize = 5000 * 1024;
                if (avatar.getSize() > maxSize) {
                    return new ResponseEntity<>("File quá lớn. Vui lòng chọn ảnh <= 5 MB", HttpStatus.BAD_REQUEST);
                }

                // Upload lên cloudinary
                avatarUrl = cloudinaryService.uploadMultipart(avatar);
            } else if (avatar == null) {
                // Nếu phía FE gửi null (user muốn xóa avatar)
                avatarUrl = "https://res.cloudinary.com/dnrxauvuu/image/upload/v1756258156/b6cayxhszrhmlv6yxqmy.png";
            }
        } catch (IOException e) {
            return new ResponseEntity<>("Upload ảnh thất bại: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        existing.setName(name);
        existing.setDescription(description);
        existing.setAvatar(avatarUrl);

        Workspace updated = workspaceService.save(existing);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}/workspace-limit")
    public ResponseEntity<?> workspaceLimit(@PathVariable Long id) {
        Optional<Subscription> subscriptionCur = subscriptionService.findActiveByUserId(id);
        if (subscriptionCur.isPresent()) {
            Integer maxWorkspace = subscriptionService.findMaxWorkspaceByCurrenSubscription(subscriptionCur.get().getId());
            return new ResponseEntity<>(maxWorkspace, HttpStatus.OK);
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body("Bạn chưa mua gói dịch vụ hoặc gói của bạn đã hết hạn");
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateWorkspaceStatus(
            @PathVariable Long id,
            @RequestBody WorkspaceStatusUpdateDTO dto) {

        if (dto == null || dto.getIds() == null || dto.getIds().isEmpty()) {
            return ResponseEntity.badRequest().body("Danh sách Id không hợp lệ");
        }

        try {
            workspaceService.updateWorkspaceStatusForUser(id, dto.getIds());
            return ResponseEntity.ok("Cập nhật trạng thái thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Cập nhật thất bại: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkspaceDetail(@PathVariable Long id) {
        Workspace ws = workspaceService.findById(id);
        if (ws == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found");
        }
        return ResponseEntity.ok(ws);
    }

    @PostMapping("/subscriptions/trial")
    public ResponseEntity<?> activateTrial(@RequestParam Long userId) {
        try {
            subscriptionManagementService.activateTrialPlan(userId);
            return ResponseEntity.ok("Đã kích hoạt gói Trial");
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
