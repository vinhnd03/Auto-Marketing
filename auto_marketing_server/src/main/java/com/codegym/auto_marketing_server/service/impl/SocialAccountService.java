package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.repository.ISocialAccountRepository;
import com.codegym.auto_marketing_server.service.ISocialAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SocialAccountService implements ISocialAccountService {
    private final ISocialAccountRepository socialAccountRepository;
}
