package com.codegym.auto_marketing_server.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${app.openapi.dev-url:http://localhost:8080}")
    private String devUrl;

    @Bean
    public OpenAPI myOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl(devUrl);
        devServer.setDescription("Server URL in Development environment");

        Contact contact = new Contact();
        contact.setEmail("support@codegym.vn");
        contact.setName("CodeGym Support");
        contact.setUrl("https://codegym.vn");

        License mitLicense = new License()
                .name("MIT License")
                .url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
                .title("CodeGym Auto Marketing Content API")
                .version("1.0")
                .contact(contact)
                .description("""
                        This API provides endpoints for generating marketing topics, content, and scheduling posts using AI.
                        
                        ## Features:
                        - **Task 9**: Generate marketing topics using AI
                        - **Task 10**: Generate post content using AI  
                        - **Task 11**: Schedule posts for publishing
                        
                        ## Usage:
                        1. First generate topics for a campaign
                        2. Approve topics you want to use
                        3. Generate content for approved topics
                        4. Schedule posts to social channels
                        """)
                .termsOfService("https://codegym.vn/terms")
                .license(mitLicense);

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer));
    }
}
