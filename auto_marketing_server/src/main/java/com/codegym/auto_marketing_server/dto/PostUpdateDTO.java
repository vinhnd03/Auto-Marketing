package com.codegym.auto_marketing_server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostUpdateDTO {
    private String title;
    private String content;
    private String hashtag;
    private Long topicId;

    // Quan trọng: để phân biệt null và []
    // null  -> giữ nguyên ảnh
    // []    -> xóa hết ảnh
    // list  -> update ảnh theo list
    private List<PostMediaDTO> medias;
    private List<Long> deletedMediaIds;
}
