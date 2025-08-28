package com.codegym.auto_marketing_server.config;

import com.codegym.auto_marketing_server.filter.JwtAuthenticationFilter;
import com.codegym.auto_marketing_server.security.jwt.service.CustomUserDetailsService;
import com.codegym.auto_marketing_server.security.jwt.service.JwtService;
import com.codegym.auto_marketing_server.security.oauth2.CustomOAuth2SuccessHandler;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
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
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Bean
    @Order(3)
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/api/social/connect/facebook/callback",
                                "/api/v1/plans", "/api/payment/vn-pay-callback").permitAll()
                        .requestMatchers("/api/user/**", "/api/schedules/**", "/api/v1/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
                        .anyRequest().authenticated()
                )
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(jwtAuthEntryPoint))
//                .oauth2Login(oauth -> oauth
////                        .loginPage("/api/auth/google")
////                                .authorizationEndpoint(auth -> auth.baseUri("/api/auth"))
//                        .successHandler(customOAuth2SuccessHandler)
//                        .failureHandler((request, response, exception) -> {
//                            String errorMessage = "oauth_error";
//                            if (exception instanceof OAuth2AuthenticationException) {
//                                errorMessage = "cancelled";
//                            }
//                            response.sendRedirect("http://localhost:3000/login?error=" + errorMessage);
//                        })
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((req, resp, auth) -> {
                            Cookie cookie = new Cookie("jwt", "");
                            cookie.setMaxAge(0);
                            cookie.setHttpOnly(true);
                            cookie.setPath("/");
                            resp.addCookie(cookie);
                            resp.setStatus(HttpServletResponse.SC_OK);
                        })
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

//    @Bean
//    public AuthenticationSuccessHandler oAuth2SuccessHandler() {
//        return new CustomOAuth2SuccessHandler(userService, jwtService, roleService, authorizedClientService, cloudinaryService);
//    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(frontendUrl, "http://10.10.8.15:3000")); // domain frontend// domain frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
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

//    @Bean
//    public JwtAuthenticationFilter jwtAuthenticationFilter() {
//        return new JwtAuthenticationFilter(jwtService, userDetailsService);
//    }

    @Bean
    @Order(1)
    public SecurityFilterChain oauth2LoginFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/oauth2/authorization/**", "/login/oauth2/code/**"
//                , "/api/social/connect/facebook/callback"
                ) // Chỉ áp dụng cho login
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .oauth2Login(oauth -> oauth
                        .successHandler(customOAuth2SuccessHandler)
                        .failureHandler((request, response, exception) -> {
                            String errorMessage = "oauth_error";
                            if (exception instanceof OAuth2AuthenticationException) {
                                errorMessage = "cancelled";
                            }
                            response.sendRedirect(frontendUrl + "/login?error=" + errorMessage);
                        })
                );
        return http.build();
    }

//    @Bean
//    @Order(2)
//    public SecurityFilterChain facebookConnectFilterChain(HttpSecurity http) throws Exception {
//        http
//                .securityMatcher("/oauth2/authorization/facebook", "/login/oauth2/code/facebook")
//                .csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(auth -> auth.anyRequest().authenticated()) // user phải login app
//                .oauth2Login(oauth -> oauth
//                        .successHandler(connectFacebookSuccessHandler)
//                        .failureHandler((request, response, exception) -> {
//                            response.sendRedirect(frontendUrl + "/facebook-connect?error");
//                        })
//                );
//        return http.build();
//    }
}