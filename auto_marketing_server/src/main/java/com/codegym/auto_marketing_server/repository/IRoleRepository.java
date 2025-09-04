package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IRoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String roleName);
}
