package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.Post;
import com.codegym.auto_marketing_server.entity.PostMedia;
import com.codegym.auto_marketing_server.repository.IPostMediaRepository;
import com.codegym.auto_marketing_server.repository.IPostRepository;
import com.codegym.auto_marketing_server.service.IPostMediaService;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class PostMediaService implements IPostMediaService {
    private final IPostMediaRepository postMediaRepository;
    private final IPostRepository postRepository;
    @Override
    public List<PostMedia> getMediasByPost(Long postId) {
        return postMediaRepository.findByPostId(postId);
    }

    @Override
    public PostMedia addMediaToPost(Long postId, PostMedia media) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        media.setPost(post);
        return postMediaRepository.save(media);
    }

    @Override
    public PostMedia updateMedia(Long id, PostMedia mediaRequest) {
        PostMedia media = postMediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found"));

        media.setUrl(mediaRequest.getUrl());
        media.setType(mediaRequest.getType());
        return postMediaRepository.save(media);
    }

    @Override
    public void deleteMedia(Long id) {
        postMediaRepository.deleteById(id);
    }
}
