package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.repository.IUserTokenRepository;
import com.codegym.auto_marketing_server.service.IUserTokenService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class UserTokenService implements IUserTokenService {
    private final IUserTokenRepository userTokenRepository;
}
