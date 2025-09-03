package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.dto.MonthStatisticDTO;
import com.codegym.auto_marketing_server.dto.NotificationDTO;
import com.codegym.auto_marketing_server.dto.QuarterStatisticDTO;
import com.codegym.auto_marketing_server.dto.WeekStatisticDTO;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.repository.IUserRepository;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import com.codegym.auto_marketing_server.service.IUserService;
import com.codegym.auto_marketing_server.util.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

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
    public long count() {
        return userRepository.count();
    }

    @Override
    public Page<User> filterUsersBySubscription(String filter, Pageable pageable) {
        if ("NO_PACKAGE".equalsIgnoreCase(filter)) {
            return userRepository.findUsersWithoutSubscription(pageable);
        } else if ("EXPIRED".equalsIgnoreCase(filter)) {
            return userRepository.findUsersWithExpiredSubscription(LocalDate.now(), pageable);
        } else if ("ACTIVE".equalsIgnoreCase(filter)) {
            return userRepository.findUsersWithActiveSubscription(LocalDate.now(), pageable);
        } else {
            return userRepository.findAll(pageable);
        }
    }

    @Override
    public Page<User> searchAndPage(String name, String planName, LocalDate startDate, LocalDate endDate,Boolean status,Pageable pageable) {
        return userRepository.searchAndPage(name, planName, startDate, endDate, status,pageable);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

//    @Override
//    public void save(User users) {
//        userRepository.save(users);
//    }

//    @Override
//    public Optional<User> findById(Long id) {
//        return userRepository.findById(id);
//    }

    @Override
    public void remove(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<MonthStatisticDTO> getStatisticByMonth(int year) {
        return userRepository.countByMonth(year);
    }

    @Override
    public List<QuarterStatisticDTO> getStatisticByQuarter(int year) {
        return userRepository.countByQuarter(year);
    }

    @Override
    public List<WeekStatisticDTO> getStatisticByWeek(int year, int month) {
        return userRepository.countByWeek(year, month);
    }

    @Override
    public List<MonthStatisticDTO> getStatisticPackagesByMonth(int year) {
        return userRepository.countPackagesByMonth(year);
    }

    @Override
    public List<QuarterStatisticDTO> getStatisticPackagesByQuarter(int year) {
        return userRepository.countPackagesByQuarter(year);
    }

    @Override
    public List<WeekStatisticDTO> getStatisticPackagesByWeek(int year, int month) {
        return userRepository.countPackagesByWeek(year,month);
    }

    @Override
    public List<NotificationDTO> getNotifications() {
        List<NotificationDTO> userCreated = userRepository.findUserCreatedNotifications();
        List<NotificationDTO> subscriptions = userRepository.findSubscriptionNotifications();

        List<NotificationDTO> all = new ArrayList<>();
        all.addAll(userCreated);
        all.addAll(subscriptions);

        // sắp xếp theo ngày giảm dần
        all.sort(Comparator.comparing(NotificationDTO::getCreatedAt).reversed());

        return all;
    }
    @Override
    public int countByMonth(int year, int month) {
        return userRepository.countByYearAndMonth(year, month);
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
