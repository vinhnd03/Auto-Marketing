package com.codegym.auto_marketing_server.entity;

import com.codegym.auto_marketing_server.enums.TokenType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_tokens")
public class UserToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String tokenHash;
    private LocalDateTime expiresAt;
    private Boolean status;
    @Enumerated(EnumType.STRING)
    private TokenType tokenType;

    //User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
