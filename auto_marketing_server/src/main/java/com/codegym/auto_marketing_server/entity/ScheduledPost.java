package com.codegym.auto_marketing_server.entity;

import com.codegym.auto_marketing_server.enums.ScheduledPostStatus;
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
@Table(name="scheduled_posts")
public class ScheduledPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="post_id")
    private Post post;

    private LocalDateTime scheduledTime;
    private LocalDateTime postedAt;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ScheduledPostStatus status = ScheduledPostStatus.DRAFT;
}
