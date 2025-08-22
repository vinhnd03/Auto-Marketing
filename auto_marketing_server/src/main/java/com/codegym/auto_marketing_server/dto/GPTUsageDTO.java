package com.codegym.auto_marketing_server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GPTUsageDTO {
    private Integer promptTokens;
    private Integer completionTokens;
    private Integer totalTokens;
}
