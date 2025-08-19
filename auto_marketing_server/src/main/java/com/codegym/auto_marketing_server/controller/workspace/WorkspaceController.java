package com.codegym.auto_marketing_server.controller.workspace;

import com.codegym.auto_marketing_server.dto.WorkspaceRequestDTO;
import com.codegym.auto_marketing_server.dto.WorkspaceStatusUpdateDTO;
import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.SocialAccountWorkspace;
import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.enums.WorkspaceStatus;
import com.codegym.auto_marketing_server.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{id}")
    public ResponseEntity<?> searchWorkspaceByUserId(@PathVariable Long id) {
        List<Workspace> workspaces = workspaceService.searchWorkspaceByUserId(id);
        return ResponseEntity.ok(workspaces);
    }

    @PostMapping("")
    public ResponseEntity<?> addWorkspace(@Valid @RequestBody WorkspaceRequestDTO workspaceRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Trả về danh sách lỗi
            List<String> errors = bindingResult.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .toList();
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        if (workspaceRequestDTO == null) {
            return new ResponseEntity<>("Dữ liệu không hợp lệ", HttpStatus.BAD_REQUEST);
        }

        Long userId = userService.selectUserIdBySocialAccountId(workspaceRequestDTO.getSocialAccountId());

        boolean exists = workspaceService.existsByNameForUser(workspaceRequestDTO.getName(), userId);
        if (exists) {
            return new ResponseEntity<>("Tên workspace đã tồn tại", HttpStatus.CONFLICT);
        }

        // Lấy social account
        SocialAccount socialAccount = socialAccountService.findById(workspaceRequestDTO.getSocialAccountId());
        if (socialAccount == null) {
            return new ResponseEntity<>("Không tìm thấy Social Account", HttpStatus.BAD_REQUEST);
        }

        // Tạo workspace từ DTO
        Workspace workspace = new Workspace();
        BeanUtils.copyProperties(workspaceRequestDTO, workspace);


        // Lưu workspace trước để có ID
        Workspace savedWorkspace = workspaceService.save(workspace, userId);

        if (savedWorkspace != null) {
            // Tạo bảng liên kết
            SocialAccountWorkspace socialAccountWorkspace = new SocialAccountWorkspace();
            socialAccountWorkspace.setWorkspace(savedWorkspace);
            socialAccountWorkspace.setSocialAccount(socialAccount);
            socialAccountWorkplaceService.save(socialAccountWorkspace);

            return new ResponseEntity<>(savedWorkspace, HttpStatus.OK);
        }

        Optional<Subscription> subscriptionCur = subscriptionService.findActiveByUserId(userId);
        if (subscriptionCur.isEmpty()) {
            return new ResponseEntity<>("Bạn chưa mua gói dịch vụ hoặc gói của bạn đã hết hạn", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("Số lượng workspace của bạn đã đạt giới hạn", HttpStatus.BAD_REQUEST);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateWorkspace(@PathVariable Long id, @Valid @RequestBody WorkspaceRequestDTO workspaceRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Trả về danh sách lỗi
            List<String> errors = bindingResult.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .toList();
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        SocialAccount socialAccount = socialAccountService.findById(workspaceRequestDTO.getSocialAccountId());
        if (socialAccount == null) {
            return new ResponseEntity<>("Không tìm thấy Social Account", HttpStatus.BAD_REQUEST);
        }

        Workspace workspace = new Workspace();
        BeanUtils.copyProperties(workspaceRequestDTO, workspace);
        workspace.setId(id);
        Workspace workspaceUpdate = workspaceService.save(workspace);
        return new ResponseEntity<>(workspaceUpdate, HttpStatus.OK);
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
    public ResponseEntity<?> updateWorkspaceStatus(@PathVariable Long id, @RequestBody WorkspaceStatusUpdateDTO dto) {
        if (dto == null || dto.getIds() == null || dto.getIds().isEmpty()) {
            return ResponseEntity.badRequest().body("Danh sách Id không hợp lệ");
        }
        List<Workspace> workspaces = workspaceService.searchWorkspaceByUserId(id);
        try {
            List<Long> activeIds = dto.getIds();
            for (Workspace ws : workspaces) {
                if (activeIds.contains(ws.getId())) {
                    ws.setStatus(WorkspaceStatus.ACTIVE);
                    workspaceService.save(ws);
                } else {
                    ws.setStatus(WorkspaceStatus.INACTIVE);
                    workspaceService.save(ws);
                }
            }
            return ResponseEntity.ok("Cập nhật trạng thái thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Cập nhật thất bại: " + e.getMessage());
        }
    }
}
