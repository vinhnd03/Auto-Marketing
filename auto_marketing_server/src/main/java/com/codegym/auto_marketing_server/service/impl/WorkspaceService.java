package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.repository.IWorkspaceRepository;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import com.codegym.auto_marketing_server.service.IWorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkspaceService implements IWorkspaceService {
    private final IWorkspaceRepository workspaceRepository;
    private final ISubscriptionService subscriptionService;

    @Override
    public List<Workspace> searchWorkspaceByUserId(Long id) {
        return workspaceRepository.searchWorkspaceByUserId(id);
    }

    @Override
    public Workspace save(Workspace workspace, Long userId) {
        Optional<Subscription> currentActiveOpt = subscriptionService.findActiveByUserId(userId);
        if (currentActiveOpt.isPresent()) {
            int maxWorkspace = subscriptionService.findMaxWorkspaceByCurrenSubscription(currentActiveOpt.get().getId());
            int totalWorkspaceOfUser = totalWorkspaceOfUser(userId);
            if (totalWorkspaceOfUser < maxWorkspace) {

                return workspaceRepository.save(workspace);
            }
        }
        return null;
    }

    @Override
    public int totalWorkspaceOfUser(Long id) {

        return workspaceRepository.totalWorkspaceOfUser(id);
    }

    @Override
    public Workspace save(Workspace workspace) {
        workspace.setUpdatedAt(LocalDate.now());

        return workspaceRepository.save(workspace);
    }


    @Override
    public boolean existsByNameForUser(String name, Long userId) {
        Integer count = workspaceRepository.countWorkspaceByNameAndUser(name, userId);
        return count != null && count > 0;
    }
}
