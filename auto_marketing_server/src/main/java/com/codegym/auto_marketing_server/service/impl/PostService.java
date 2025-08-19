package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.repository.IPostRepository;
import com.codegym.auto_marketing_server.service.IPostService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PostService implements IPostService {
    private  final IPostRepository postRepository;
}
