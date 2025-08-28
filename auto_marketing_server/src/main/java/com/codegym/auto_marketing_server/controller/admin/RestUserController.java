package com.codegym.auto_marketing_server.controller.admin;


import com.codegym.auto_marketing_server.dto.StatisticResponse;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.service.IUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class RestUserController {
    private final IUserService userService;

    public RestUserController(IUserService userService) {
        this.userService = userService;
    }

    @GetMapping("")
    public ResponseEntity<Page<User>> searchAndPage(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String planName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Boolean status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size,sort);
        Page<User> usersPage = userService.searchAndPage(name, planName, startDate, endDate, status, pageable);

        if (usersPage.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(usersPage, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<User>> searchUsers(
            @RequestParam(required = false) String subscriptionFilter, // NO_PACKAGE | EXPIRED | ACTIVE
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users=userService.filterUsersBySubscription(subscriptionFilter,pageable);
        return ResponseEntity.ok(users);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Optional<User>> findUserById(@PathVariable Long id) {
        Optional<User> usersOptional = userService.findById(id);
        if (usersOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 không tìm thấy
        }
        return new ResponseEntity<>(usersOptional, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        userService.save(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }


    @PatchMapping("/{id}")
    public ResponseEntity<User> updateStatus(@PathVariable Long id, @RequestBody User users) {
        Optional<User> usersOptional = userService.findById(id);
        if (usersOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        User user = usersOptional.get();
        if (users.getStatus() != null) {  // chỉ cập nhật status
            user.setStatus(users.getStatus());
        }
        userService.save(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
    @GetMapping("/statistics")
    public ResponseEntity<StatisticResponse> getStatistics(
            @RequestParam int year,
            @RequestParam(required = false) Integer month) {

        StatisticResponse response = new StatisticResponse();

        // Thống kê theo tháng
        response.setMonthly(userService.getStatisticByMonth(year));

        // Thống kê theo quý
        response.setQuarterly(userService.getStatisticByQuarter(year));

        // Nếu có tháng => thêm thống kê tuần
        response.setWeekly(month != null ? userService.getStatisticByWeek(year, month) : null);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/statistics_packages")
    public ResponseEntity<StatisticResponse> getStatisticsPackages(
            @RequestParam int year,
            @RequestParam(required = false) Integer month) {

        StatisticResponse response = new StatisticResponse();

        // Thống kê theo tháng (dựa trên startDate của gói)
        response.setMonthly(userService.getStatisticPackagesByMonth(year));

        // Thống kê theo quý
        response.setQuarterly(userService.getStatisticPackagesByQuarter(year));

        // Nếu có tháng => thêm thống kê tuần
        response.setWeekly(month != null ? userService.getStatisticPackagesByWeek(year, month) : null);

        return ResponseEntity.ok(response);
    }

    //3 chức năng làm thêm
    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications() {
        try {
            return ResponseEntity.ok(userService.getNotifications());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount() {
        return ResponseEntity.ok(userService.count());
    }

    @GetMapping("/statistics/monthly-detail")
    public ResponseEntity<Map<String, Object>> getMonthlyDetail(
            @RequestParam int year,
            @RequestParam int month) {

        // --- Lấy dữ liệu tháng hiện tại ---
        int currentCount = userService.countByMonth(year, month);

        // --- Xác định tháng trước ---
        int prevMonth = (month == 1) ? 12 : month - 1;
        int prevYear = (month == 1) ? year - 1 : year;

        int prevCount = userService.countByMonth(prevYear, prevMonth);

        // --- Tạo response ---
        Map<String, Object> response = new HashMap<>();
        response.put("current", Map.of("year", year, "month", month, "count", currentCount));
        response.put("previous", Map.of("year", prevYear, "month", prevMonth, "count", prevCount));

        return ResponseEntity.ok(response);
    }

}
