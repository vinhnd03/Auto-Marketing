package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.Role;
import com.codegym.auto_marketing_server.repository.IRoleRepository;
import com.codegym.auto_marketing_server.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {
    private final IRoleRepository roleRepository;

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public void save(Role roles) {
        roleRepository.save(roles);
    }

    @Override
    public Optional<Role> findById(Long id) {
        return roleRepository.findById(id);
    }

    @Override
    public void remove(Long id) {
        roleRepository.deleteById(id);
    }
}
