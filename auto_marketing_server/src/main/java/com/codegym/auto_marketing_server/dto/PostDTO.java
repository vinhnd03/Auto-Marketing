package com.codegym.auto_marketing_server.dto;

import java.util.List;

public record PostDTO(
        Long id,
        String title,
        String content,
        String hashtag,
        List<PostMediaDTO> medias
) {}
