package com.codegym.auto_marketing_server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GPTRequestDTO {
    private String model = "gpt-3.5-turbo";
    private List<GPTMessage> messages;
    private Integer max_tokens = 1000;
    private Double temperature = 0.7;
}