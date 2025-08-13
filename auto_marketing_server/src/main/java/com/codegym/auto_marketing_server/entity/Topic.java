package com.codegym.auto_marketing_server.entity;

import com.codegym.auto_marketing_server.enums.TopicStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "topics")
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TopicStatus status = TopicStatus.PENDING;
    private Boolean generatedByAI;
    private String aiPrompt;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;
}
