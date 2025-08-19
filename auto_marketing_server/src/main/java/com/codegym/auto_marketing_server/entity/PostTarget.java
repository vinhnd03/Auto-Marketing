package com.codegym.auto_marketing_server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "post_targets", uniqueConstraints =
        {@UniqueConstraint(columnNames = {"schedule_post_id", "fanpage_id"})})
public class PostTarget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "schedule_post_id", nullable = false)
    private ScheduledPost scheduledPost;

    @ManyToOne
    @JoinColumn(name = "fanpage_id", nullable = false)
    private Fanpage fanpage;
}
