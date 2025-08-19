package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.Role;
import com.codegym.auto_marketing_server.repository.IRoleRepository;
import com.codegym.auto_marketing_server.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {
    private final IRoleRepository roleRepository;

    @Override
    public Optional<Role> findByName(String roleName) {
        return roleRepository.findByName(roleName);
    }

    @Override
    public Role save(Role role) {
        return roleRepository.save(role);
    }
}
