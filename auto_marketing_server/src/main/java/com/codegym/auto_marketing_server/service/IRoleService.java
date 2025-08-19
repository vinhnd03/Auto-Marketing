package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Role;

import java.util.Optional;

public interface IRoleService {
    Optional<Role> findByName(String name);

    Role save(Role role);
}
