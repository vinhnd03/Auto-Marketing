package com.codegym.auto_marketing_server.controller.publish;

import com.codegym.auto_marketing_server.dto.ScheduleRequestDTO;
import com.codegym.auto_marketing_server.entity.ScheduledPost;
import com.codegym.auto_marketing_server.service.impl.ScheduledPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedules")
public class ScheduledPostController {
    private final ScheduledPostService scheduledPostService;
    @PostMapping
    public ResponseEntity<ScheduledPost> create(@RequestBody ScheduleRequestDTO req) {
        System.out.println(req.scheduledTime());
        return ResponseEntity.ok(scheduledPostService.createSchedule(req));
    }

    // 1. Lấy danh sách bài đã PUBLISHED
    @GetMapping("/published")
    public ResponseEntity<List<ScheduledPost>> getPublishedPosts() {
        return ResponseEntity.ok(scheduledPostService.getPublishedPosts());
    }

    //2. Xem chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<ScheduledPost> getScheduledPost(@PathVariable Long id) {
        return scheduledPostService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //3. Cập nhật (nếu cần cho phép sửa)
    @PutMapping("/{id}")
    public ResponseEntity<ScheduledPost> updateScheduledPost(@PathVariable Long id, @RequestBody ScheduledPost updated) {
        try {
            return ResponseEntity.ok(scheduledPostService.updateScheduledPost(id,updated));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 4. Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheduledPost(@PathVariable Long id) {
        if (scheduledPostService.getById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        scheduledPostService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
