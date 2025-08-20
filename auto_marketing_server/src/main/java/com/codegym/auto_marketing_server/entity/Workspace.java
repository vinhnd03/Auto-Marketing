package com.codegym.auto_marketing_server.entity;


import com.codegym.auto_marketing_server.enums.WorkspaceStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="workspaces")
public class Workspace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String avatar;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    @Enumerated(EnumType.STRING)
    @Column(name="status")
    private WorkspaceStatus status = WorkspaceStatus.ACTIVE;

    @PrePersist
    public void prePersist() {
        if (this.avatar == null || this.avatar.isBlank()) {
            this.avatar = "https://haycafe.vn/wp-content/uploads/2022/10/Hinh-anh-anime-nu-buon.jpg";
        }
        this.createdAt = LocalDate.now();
    }
}
