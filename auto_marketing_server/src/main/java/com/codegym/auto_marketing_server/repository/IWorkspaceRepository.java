package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IWorkspaceRepository  extends JpaRepository<Workspace, Long> {
}
