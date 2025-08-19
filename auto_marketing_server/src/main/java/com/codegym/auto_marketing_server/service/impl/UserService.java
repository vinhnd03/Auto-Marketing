package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.repository.IUserRepository;
import com.codegym.auto_marketing_server.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final IUserRepository userRepository;

    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public Long selectUserIdBySocialAccountId(Long id) {
        return userRepository.selectUserIdBySocialAccountId(id);
    }
    private final PasswordEncoder passwordEncoder;
    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User save(User user) {
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            if(user.getId() == null){
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
        }
        return userRepository.save(user);
    }

    @Override
    public void changePassword(Long userId, String password){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (password != null && !password.isBlank()) {
            System.out.println(password);
            user.setPassword(passwordEncoder.encode(password));
        }
        userRepository.save(user);
    }

    @Override
    public Boolean existedByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
