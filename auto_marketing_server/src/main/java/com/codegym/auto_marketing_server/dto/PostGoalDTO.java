package com.codegym.auto_marketing_server.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class PostGoalDTO {
    @Min(value = 0, message = "Target likes must be >= 0")
    private Integer likes = 0;
}