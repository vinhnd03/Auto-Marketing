package com.codegym.auto_marketing_server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "post_targets")
public class PostTarget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String postUrl;

    // Chỉ giữ lại trường lượt thích
    @Column(name = "target_likes")
    private Integer targetLikes = 0;

    @Column(name = "actual_likes")
    private Integer actualLikes = 0;

    // Thêm timestamps
    @Column(name = "goals_set_at")
    private LocalDateTime goalsSetAt;

    @Column(name = "stats_updated_at")
    private LocalDateTime statsUpdatedAt;

    // Làm nullable để tránh lỗi constraint
    @ManyToOne
    @JoinColumn(name = "schedule_post_id") // Bỏ nullable = false
    private ScheduledPost scheduledPost;

    @ManyToOne
    @JoinColumn(name = "fanpage_id") // Bỏ nullable = false
    private Fanpage fanpage;

    // Quan trọng: Thêm relation với Post
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @PrePersist
    protected void onCreate() {
        if (goalsSetAt == null) goalsSetAt = LocalDateTime.now();
        if (statsUpdatedAt == null) statsUpdatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        statsUpdatedAt = LocalDateTime.now();
    }

    // Helper method chỉ check lượt thích
    public boolean hasGoals() {
        return targetLikes != null && targetLikes > 0;
    }

    public boolean hasActualStats() {
        return actualLikes != null && actualLikes > 0;
    }
}