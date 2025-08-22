package com.codegym.auto_marketing_server;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaRepositories
@EnableAsync
@EnableScheduling
public class AutoMarketingServerApplication {

    public static void main(String[] args) {
//        // Load .env
//        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
//
//        // Set system properties from .env
//        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        // Run Spring Application
        SpringApplication.run(AutoMarketingServerApplication.class, args);
    }
}
