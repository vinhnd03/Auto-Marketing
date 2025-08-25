package com.codegym.auto_marketing_server.dto;

public record FanpageDTO(
        Long id,
        String pageId,
        String pageName,
        String avatarUrl
) {}