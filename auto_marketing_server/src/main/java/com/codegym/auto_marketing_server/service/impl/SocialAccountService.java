package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.SocialAccountDTO;
import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.repository.ISocialAccountRepository;
import com.codegym.auto_marketing_server.service.ISocialAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SocialAccountService implements ISocialAccountService {
    private final ISocialAccountRepository socialAccountRepository;

    @Override
    public SocialAccount findById(Long id) {
        return socialAccountRepository.findById(id).orElse(null);
    }

    @Override
    public List<SocialAccountDTO> getSocialAccountsByUserId(Long userId) {
        return socialAccountRepository.getSocialAccountsByUserId(userId);
    }
}
