package com.codegym.auto_marketing_server.entity;

import com.codegym.auto_marketing_server.enums.CampaignStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import org.hibernate.annotations.Where;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "campaigns")
@Where(clause = "soft_del = false")
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CampaignStatus status = CampaignStatus.DRAFT;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean softDel ;
    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;


}
