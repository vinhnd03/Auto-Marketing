package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Workspace;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface IWorkspaceService {
    List<Workspace> searchWorkspaceByUserId(Long id);

    Workspace save(Workspace workspace, Long userId);

    int totalWorkspaceOfUser(@Param("id") Long id);

    Workspace save(Workspace workspace);


    boolean existsByNameForUser(String name, Long userId);

    Workspace findById(Long id);

    boolean existsByNameForUserExceptId(String name, Long userId, Long excludeId);
}
