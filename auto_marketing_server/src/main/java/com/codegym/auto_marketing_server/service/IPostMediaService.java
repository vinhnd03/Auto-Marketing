package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.PostMedia;

import java.util.List;

public interface IPostMediaService {
    List<PostMedia> getMediasByPost(Long postId);
    PostMedia addMediaToPost(Long postId, PostMedia media);
    PostMedia updateMedia(Long id, PostMedia mediaRequest);
    void deleteMedia(Long id);
}
