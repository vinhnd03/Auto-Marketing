package com.codegym.auto_marketing_server.dto;

import lombok.Data;

@Data
public class ImageGenerationRequestDTO {
    private Long postId;
    private String prompt;
    private String style;
    private int numImages;
}