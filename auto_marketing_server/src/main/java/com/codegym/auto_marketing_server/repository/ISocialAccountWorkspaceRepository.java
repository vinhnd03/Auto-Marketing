package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.SocialAccountWorkspace;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ISocialAccountWorkspaceRepository extends JpaRepository<SocialAccountWorkspace, Long> {
}
