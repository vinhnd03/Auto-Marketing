package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.dto.MonthStatisticDTO;
import com.codegym.auto_marketing_server.dto.NotificationDTO;
import com.codegym.auto_marketing_server.dto.QuarterStatisticDTO;
import com.codegym.auto_marketing_server.dto.WeekStatisticDTO;
import com.codegym.auto_marketing_server.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IUserService {

    long count();
    public Page<User> filterUsersBySubscription(String filter, Pageable pageable);

    Page<User> searchAndPage(String name,
                              String planName,
                              LocalDate startDate,
                              LocalDate endDate,
                             Boolean status,
                              Pageable pageable
                             );


    List<User> findAll();

    void save(User users);

    Optional<User> findById(Long id);

    void remove(Long id);

    List<MonthStatisticDTO> getStatisticByMonth(int year);

    List<QuarterStatisticDTO> getStatisticByQuarter(int year);

    List<WeekStatisticDTO> getStatisticByWeek(int year, int month);
    List<MonthStatisticDTO> getStatisticPackagesByMonth(int year);

    List<QuarterStatisticDTO> getStatisticPackagesByQuarter(int year);

    List<WeekStatisticDTO> getStatisticPackagesByWeek(int year, int month);
    List<NotificationDTO> getNotifications();
    int countByMonth(int year, int month);

}
