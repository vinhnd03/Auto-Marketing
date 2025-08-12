package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.repository.IRoleRepository;
import com.codegym.auto_marketing_server.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {
    private final IRoleRepository roleRepository;
}
