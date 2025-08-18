package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.SocialAccountWorkspace;
import com.codegym.auto_marketing_server.repository.ISocialAccountWorkspaceRepository;
import com.codegym.auto_marketing_server.service.ISocialAccountWorkplaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SocialAccountWorkspaceService implements ISocialAccountWorkplaceService {
    private final ISocialAccountWorkspaceRepository socialAccountWorkspaceRepository;

    @Override
    public void save(SocialAccountWorkspace socialAccountWorkspace) {
        socialAccountWorkspaceRepository.save(socialAccountWorkspace);
    }


}
