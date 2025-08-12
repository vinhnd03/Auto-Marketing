package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.repository.IUserRepository;
import com.codegym.auto_marketing_server.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final IUserRepository userRepository;
}
