package com.codegym.auto_marketing_server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GPTChoiceDTO {
    private Integer index;
    private GPTMessageDTO message;
    private String finishReason;
}
