package com.codegym.auto_marketing_server.entity;


import com.codegym.auto_marketing_server.enums.PostStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition = "TEXT")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content; 

    private String hashtag;
    private Boolean generatedByAI;
    private String aiPrompt;
    private String aiModel;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PostStatus status = PostStatus.DRAFT;
    private String contentType;
    private String tone;
    private Integer targetAudience;
    @Column(columnDefinition = "TEXT")
    private String tokenUsage;
    private LocalDateTime generateTime;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    @ManyToOne
    @JoinColumn(name = "topic_id")
    private Topic topic;
}
