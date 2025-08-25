package com.codegym.auto_marketing_server.controller.publish;

import com.codegym.auto_marketing_server.dto.PostMediaDTO;
import com.codegym.auto_marketing_server.dto.ScheduleRequestDTO;
import com.codegym.auto_marketing_server.dto.ScheduledPostDTO;
import com.codegym.auto_marketing_server.entity.ScheduledPost;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.enums.PostMediaType;
import com.codegym.auto_marketing_server.service.IUserService;
import com.codegym.auto_marketing_server.service.impl.ScheduledPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedules")
public class ScheduledPostController {

    private final ScheduledPostService scheduledPostService;
    private final IUserService userService;
    // 1. Tạo mới ScheduledPost (kèm Post + Media)
    @PostMapping
    public ResponseEntity<ScheduledPost> create(@Valid @RequestBody ScheduleRequestDTO req) {
        ScheduledPost created = scheduledPostService.createSchedule(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 2. Lấy danh sách bài đã được lên lịch (status = SCHEDULED)
//    @GetMapping("/published")
//    public ResponseEntity<List<ScheduledPostDTO>> getPublishedPosts() {
//        return ResponseEntity.ok(scheduledPostService.getPublishedPosts());
//    }
    @GetMapping("/published")
    public ResponseEntity<List<ScheduledPostDTO>> getPublishedPosts(Principal principal) {
        Optional<User> optionalUser = userService.findByEmail(principal.getName());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = optionalUser.get();
        List<ScheduledPostDTO> posts = scheduledPostService.getPublishedPostsByUser(user.getId());
        return ResponseEntity.ok(posts);
    }


    // 3. Xem chi tiết một ScheduledPost
    @GetMapping("/{id}")
    public ResponseEntity<ScheduledPost> getScheduledPost(@PathVariable Long id) {
        return scheduledPostService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Cập nhật ScheduledPost (bao gồm Post + Media)
//    @PutMapping("/{id}")
//    public ResponseEntity<?> updateScheduledPost(
//            @PathVariable Long id,
//            @Valid @RequestBody ScheduleRequestDTO req) {
//        try {
//            ScheduledPost updated = scheduledPostService.updateScheduledPost(id, req);
//            return ResponseEntity.ok(updated);
//        } catch (RuntimeException e) {
//            if(e.getMessage().contains("not found") || e.getMessage().contains("Fanpage"))
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateScheduledPost(
            @PathVariable Long id,
            @RequestPart("request") @Valid ScheduleRequestDTO req,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        try {
            List<PostMediaDTO> allMedias = new ArrayList<>();
            if (req.medias() != null) {
                allMedias.addAll(req.medias());
            }

            if (files != null) {
                for (MultipartFile file : files) {
                    File temp = File.createTempFile("upload-", file.getOriginalFilename());
                    file.transferTo(temp);
                    allMedias.add(new PostMediaDTO(null, temp.getAbsolutePath(), PostMediaType.PIC));
                }
            }

            // tạo bản copy ScheduleRequestDTO mới với medias đã merge
            ScheduleRequestDTO mergedReq = new ScheduleRequestDTO(
                    req.postId(),
                    req.title(),
                    req.content(),
                    req.hashtag(),
                    req.tone(),
                    req.contentType(),
                    req.targetAudience(),
                    allMedias,
                    req.fanpageIds(),
                    req.scheduledTime(),
                    req.imageUrl()
            );

            ScheduledPost updated = scheduledPostService.updateScheduledPost(id, mergedReq);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }




    // 5. Xóa ScheduledPost
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheduledPost(@PathVariable Long id) {
        if (scheduledPostService.getById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        scheduledPostService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
