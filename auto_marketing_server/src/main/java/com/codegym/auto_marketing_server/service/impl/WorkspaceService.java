package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.repository.IWorkspaceRepository;
import com.codegym.auto_marketing_server.service.IWorkspaceService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class WorkspaceService implements IWorkspaceService {
    private final IWorkspaceRepository workspaceRepository;
}
