package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Workspace;

import java.util.Optional;

public interface IWorkspaceService {
    Optional<Workspace> getWorkspaceById(Long id);

}
