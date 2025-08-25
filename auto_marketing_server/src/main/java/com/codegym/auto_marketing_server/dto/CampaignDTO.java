package com.codegym.auto_marketing_server.dto;

import com.codegym.auto_marketing_server.enums.CampaignStatus;
import lombok.*;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.time.LocalDate;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

public class CampaignDTO implements Validator {
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private CampaignStatus status;
    private Long workspaceId;

    @Override
    public boolean supports(Class<?> clazz) {
        return CampaignDTO.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        CampaignDTO dto = (CampaignDTO) target;
        // Validate tên
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            errors.rejectValue("name", "name.empty", "Tên chiến dịch không được để trống");
        }

        // Validate mô tả
        if (dto.getDescription() == null || dto.getDescription().trim().isEmpty()) {
            errors.rejectValue("description", "description.empty", "Mô tả chiến dịch không được để trống");
        }

        // Validate workspace
        if (dto.getWorkspaceId() == null) {
            errors.rejectValue("workspaceId", "workspaceId.empty", "Phải chọn workspace");
        }

        // Validate ngày bắt đầu & kết thúc
        if (dto.getStartDate() == null) {
            errors.rejectValue("startDate", "startDate.empty", "Ngày bắt đầu không được để trống");
        }
        if (dto.getEndDate() == null) {
            errors.rejectValue("endDate", "endDate.empty", "Ngày kết thúc không được để trống");
        }

        if (dto.getStartDate() != null && dto.getEndDate() != null) {
            if (dto.getStartDate().isAfter(dto.getEndDate())) {
                errors.rejectValue("startDate", "startDateAfterEndDate", "Ngày bắt đầu phải trước ngày kết thúc");
            }
        }

        // Validate status (nếu muốn)
        if (dto.getStatus() == null) {
            errors.rejectValue("status", "status.empty", "Trạng thái không được để trống");
        }
    }
}
