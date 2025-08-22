package com.codegym.auto_marketing_server.dto;

import com.codegym.auto_marketing_server.enums.PostMediaType;

public record PostMediaDTO(
        Long id,
        String url,
        PostMediaType type
) {
}
