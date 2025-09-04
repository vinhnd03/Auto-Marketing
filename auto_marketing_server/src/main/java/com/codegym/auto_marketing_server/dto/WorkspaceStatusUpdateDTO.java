package com.codegym.auto_marketing_server.dto;

import com.codegym.auto_marketing_server.enums.WorkspaceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WorkspaceStatusUpdateDTO {
    private List<Long> ids; // danh sách workspace ID cần update
    private WorkspaceStatus status;
}
