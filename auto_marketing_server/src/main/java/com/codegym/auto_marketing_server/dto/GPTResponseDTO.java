package com.codegym.auto_marketing_server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GPTResponseDTO {
    private String id;
    private String object;
    private Long created;
    private String model;
    private List<GPTChoice> choices;
    private GPTUsage usage;
}
