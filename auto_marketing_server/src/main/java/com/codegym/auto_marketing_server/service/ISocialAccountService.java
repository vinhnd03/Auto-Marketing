package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.SocialAccount;

public interface ISocialAccountService {
    SocialAccount findById(Long id);
}
