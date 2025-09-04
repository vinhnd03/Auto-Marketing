package com.codegym.auto_marketing_server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WorkspaceRequestDTO {
    @NotBlank(message = "Tên workspace không được để trống")
    @Size(max = 50, message = "Tên workspace không vượt quá 50 ký tự")
    private String name;
    @NotBlank(message = "Mô tả không được để trống")
    @Size(max = 255, message = "Mô tả không vượt quá 255 ký tự")
    private String description;

    private String avatar;

    @PastOrPresent(message = "Ngày tạo không được ở tương lai")
    private LocalDate createdAt;

    @NotNull(message = "SocialAccountId là bắt buộc")
    private Long socialAccountId;
}
