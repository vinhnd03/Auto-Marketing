package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.dto.SocialAccountDTO;
import com.codegym.auto_marketing_server.entity.SocialAccount;

import java.util.List;

public interface ISocialAccountService {
    SocialAccount findById(Long id);

    List<SocialAccountDTO> getSocialAccountsByUserId(Long userId);
}
