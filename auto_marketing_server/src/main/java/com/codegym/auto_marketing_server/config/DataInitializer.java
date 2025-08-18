package com.codegym.auto_marketing_server.config;

import com.codegym.auto_marketing_server.entity.Role;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.service.IRoleService;
import com.codegym.auto_marketing_server.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final IUserService userService;
    private final IRoleService roleService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initAdmin() {
        return args -> {
            // Kiểm tra xem role ADMIN đã có chưa
            Role adminRole = roleService.findByName("ADMIN").orElse(null);
            if (adminRole == null) {
                adminRole = new Role();
                adminRole.setName("ADMIN");
                roleService.save(adminRole);
            }

            // Kiểm tra xem user admin đã tồn tại chưa
            if (userService.findByEmail("admin@gmail.com").isEmpty()) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword("123456"); // mã hóa password
                admin.setStatus(true);
                admin.setRole(adminRole);
                userService.save(admin);
                System.out.println("Admin user created!");
            }
        };
    }
}
