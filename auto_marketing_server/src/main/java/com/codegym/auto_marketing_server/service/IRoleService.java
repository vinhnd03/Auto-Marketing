package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Role;

import java.util.Optional;

import com.codegym.auto_marketing_server.entity.Role;

import java.util.List;
import java.util.Optional;

public interface IRoleService {
    List<Role> findAll();

//    void save(Role roles);

    Optional<Role> findById(Long id);

    void remove(Long id);
    Optional<Role> findByName(String name);

    Role save(Role role);
}
