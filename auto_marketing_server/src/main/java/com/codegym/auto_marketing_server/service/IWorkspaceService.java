package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.enums.WorkspaceStatus;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IWorkspaceService {
    List<Workspace> searchWorkspaceByUserId(Long id);

    Workspace save(Workspace workspace, Long userId);

    int totalWorkspaceOfUser(@Param("id") Long id);

    Workspace save(Workspace workspace);


    boolean existsByNameForUser(String name,Long userId);
}
