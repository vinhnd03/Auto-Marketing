package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.User;
import org.springframework.data.repository.query.Param;

public interface IUserService {
    User findById(Long id);

    Long selectUserIdBySocialAccountId(@Param("id") Long id);
}
