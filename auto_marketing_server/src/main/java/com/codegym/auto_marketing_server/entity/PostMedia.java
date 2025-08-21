package com.codegym.auto_marketing_server.entity;


import com.codegym.auto_marketing_server.enums.PostMediaType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="post_medias")
public class PostMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String url;
    @Enumerated(EnumType.STRING)
    @Column(name="type")
    private PostMediaType type = PostMediaType.PIC;

    @ManyToOne
    @JoinColumn(name="post_id")
    @JsonBackReference
    private Post post;
}
