package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.repository.IWorkspaceRepository;
import com.codegym.auto_marketing_server.service.IWorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class WorkspaceService implements IWorkspaceService {
    private final IWorkspaceRepository workspaceRepository;

    @Override
    public Optional<Workspace> getWorkspaceById(Long id) {
        return workspaceRepository.findById(id);
    }
}
