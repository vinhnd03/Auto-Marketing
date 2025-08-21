package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.repository.IUserRepository;
import com.codegym.auto_marketing_server.service.IUserService;
import com.codegym.auto_marketing_server.util.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final IUserRepository userRepository;

    @Override
    public Long selectUserIdBySocialAccountId(Long id) {
        return userRepository.selectUserIdBySocialAccountId(id);
    }
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;

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
    public String updateAvatar(Long userId, String newAvatar) throws Exception {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return null;
        }

        User user = userOptional.get();
        if (user.getAvatar() != null) {
            cloudinaryService.deleteImageByUrl(user.getAvatar());
        }
        String uploadedAvatar = cloudinaryService.uploadImageFromUrl(newAvatar);
        user.setAvatar(uploadedAvatar);
        userRepository.save(user);

        return uploadedAvatar;
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

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public void updateUserProfile(User user){
        try {
            String avatarUrl = cloudinaryService.uploadImageFromUrl(user.getAvatar());
            user.setAvatar(avatarUrl);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        userRepository.save(user);
    }

    @Override
    public User getCurrentUser() {
        // Lấy Authentication hiện tại
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        // Lấy username/email từ principal
        Object principal = authentication.getPrincipal();

        String email = null;

        if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
            email = userDetails.getUsername(); // nếu dùng UserDetailsService
        } else if (principal instanceof User user) {
            return user; // nếu lưu trực tiếp User trong principal
        } else if (principal instanceof OAuth2User oauth2User) {
            email = oauth2User.getAttribute("email");
        }

        if (email != null) {
            return userRepository.findByEmail(email).orElse(null);
        }

        return null;
    }
}
