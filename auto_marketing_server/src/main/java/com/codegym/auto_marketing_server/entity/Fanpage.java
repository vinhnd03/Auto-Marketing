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
@Table(name="fanpage")
public class Fanpage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String pageId;
    @Column(columnDefinition = "TEXT")
    private String pageAccessNameToken;
    private String pageName;
    private String avatarUrl;
    private LocalDateTime tokenExpireAt;
}
