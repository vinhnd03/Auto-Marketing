package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRoleRepository extends JpaRepository<Role, Long> {
}
