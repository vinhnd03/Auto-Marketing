package com.codegym.auto_marketing_server.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.List;

public record ScheduleRequestDTO(
        Long postId,                 // nếu update / dùng lại post cũ thì truyền id
        @NotBlank(message = "Tiêu đề không được để trống")
//        @Size(max = 100, message = "Tiêu đề tối đa 100 ký tự")
        String title,                // title của Post
        @NotBlank(message = "Nội dung không được để trống")
        String content,              // content của Post
        String hashtag,              // hashtag
        String tone,                 // giọng điệu
        String contentType,          // loại content
        @Min(value = 1, message = "Target Audience phải >= 1")
        Integer targetAudience,      // đối tượng mục tiêu
//        @NotEmpty(message = "Cần ít nhất 1 media")
        List<PostMediaDTO> medias,   // danh sách media (ảnh/video)
        @NotEmpty(message = "Cần chọn ít nhất 1 fanpage")
        List<Long> fanpageIds,       // danh sách fanpage target
        @Future(message = "Thời gian đăng phải ở tương lai")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
        LocalDateTime scheduledTime, // thời gian đăng bài
        String imageUrl
) {
}
