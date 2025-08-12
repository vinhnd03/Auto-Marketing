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
@Table(name = "social_account_workspace", uniqueConstraints =
        {@UniqueConstraint(columnNames = {"social_account_id", "workspace_id"})})
public class SocialAccountWorkspace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "social_account_id", nullable = false)
    private SocialAccount socialAccount;

//    @ManyToOne
//    @JoinColumn(name = "workspace_id", nullable = false)
//    private Workspace workspace;
}
