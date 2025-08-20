package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.MonthStatisticDTO;
import com.codegym.auto_marketing_server.dto.NotificationDTO;
import com.codegym.auto_marketing_server.dto.QuarterStatisticDTO;
import com.codegym.auto_marketing_server.dto.WeekStatisticDTO;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.repository.IUserRepository;
import com.codegym.auto_marketing_server.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final IUserRepository userRepository;

    @Override
    public Page<User> searchAndPage(String name, String planName, LocalDate startDate, LocalDate endDate,Boolean status,Pageable pageable) {
        return userRepository.searchAndPage(name, planName, startDate, endDate, status,pageable);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public void save(User users) {
        userRepository.save(users);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

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
}
