package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.User;
import org.springframework.data.repository.query.Param;

import com.codegym.auto_marketing_server.entity.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface IUserService {

    Long selectUserIdBySocialAccountId(@Param("id") Long id);
    Optional<User> findByEmail(String username);

    User save(User user);

    String updateAvatar(Long userId, String newAvatar) throws Exception;

    void changePassword(Long userId, String password);

    Boolean existedByEmail(String email);

    Optional<User> findById(Long id);

    void updateUserProfile(User user);
}
