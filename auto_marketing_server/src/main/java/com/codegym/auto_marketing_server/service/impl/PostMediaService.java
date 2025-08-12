package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.repository.IPostMediaRepository;
import com.codegym.auto_marketing_server.service.IPostMediaService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PostMediaService implements IPostMediaService {
    private final IPostMediaRepository postMediaRepository;
}
