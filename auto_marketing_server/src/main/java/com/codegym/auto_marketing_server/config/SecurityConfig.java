package com.codegym.auto_marketing_server.config;

import com.codegym.auto_marketing_server.filter.JwtAuthenticationFilter;
import com.codegym.auto_marketing_server.security.jwt.service.CustomUserDetailsService;
import com.codegym.auto_marketing_server.security.jwt.service.JwtService;
import com.codegym.auto_marketing_server.security.oauth2.CustomOAuth2SuccessHandler;
import com.codegym.auto_marketing_server.service.IRoleService;
import com.codegym.auto_marketing_server.service.IUserService;
import com.codegym.auto_marketing_server.util.CloudinaryService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/api/v1/topics/generate", "/api/v1/topics/generate/**",
                                "/api/v1/posts/generate").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/user/**").hasRole("USER")
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth -> oauth
//                        .loginPage("/api/auth/google")
                                .successHandler(customOAuth2SuccessHandler)
                                .failureHandler((request, response, exception) -> {
                                    String errorMessage = "oauth_error";
                                    if (exception instanceof OAuth2AuthenticationException) {
                                        errorMessage = "cancelled";
                                    }
                                    response.sendRedirect("http://localhost:3000/login?error=" + errorMessage);
                                })
                ).logout(logout -> logout
                                .logoutUrl("/api/auth/logout")
                                .logoutSuccessHandler((req, resp, auth) -> {
                                    Cookie cookie = new Cookie("jwt", "");
                                    cookie.setMaxAge(0);
                                    cookie.setHttpOnly(true);
                                    cookie.setPath("/");
//                            cookie.setSecure(true);
                                    resp.addCookie(cookie);
                                    resp.setStatus(HttpServletResponse.SC_OK);
                                })
                );
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

//    @Bean
//    public AuthenticationSuccessHandler oAuth2SuccessHandler() {
//        return new CustomOAuth2SuccessHandler(userService, jwtService, roleService, authorizedClientService, cloudinaryService);
//    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // domain frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true); // <--- QUAN TRỌNG
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtService, userDetailsService);
    }
}