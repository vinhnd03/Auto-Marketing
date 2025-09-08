package com.codegym.auto_marketing_server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "post_insights")
public class PostInsight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "post_target_id", unique = true)
    private PostTarget postTarget;

    private Integer likeCount = 0;
    private Integer commentCount = 0;
    private Integer shareCount = 0;

    private LocalDateTime lastCheckedAt;
}

