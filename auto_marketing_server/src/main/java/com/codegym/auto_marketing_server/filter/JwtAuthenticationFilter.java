package com.codegym.auto_marketing_server.filter;

import com.codegym.auto_marketing_server.security.jwt.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {


        String token = null;
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if (c.getName().equals("jwt")) {
                    token = c.getValue();
                    break;
                }
            }
        }


//        if (token != null && jwtService.validateToken(token)) {
//            String username = jwtService.getUsernameFromToken(token);
//            UserDetails user = userDetailsService.loadUserByUsername(username);
//
//            UsernamePasswordAuthenticationToken auth =
//                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
//            SecurityContextHolder.getContext().setAuthentication(auth);
//
//            // Kiểm tra thời gian còn lại
//            Claims claims = jwtService.extractAllClaims(token);
//            long expTime = claims.getExpiration().getTime();
//            long now = System.currentTimeMillis();
//            long remainingTime = expTime - now;
//
////             Nếu còn < 10 phút thì refresh
////            if (remainingTime < 10 * 60 * 1000) {
////                String newToken = jwtService.refreshToken(token, 30 * 60 * 1000); // 30 phút
////                ResponseCookie cookie = ResponseCookie.from("jwt", newToken)
////                        .httpOnly(true)
////                        .sameSite("Lax")
////                        .path("/")
////                        .maxAge(30 * 60)
////                        .build();
////                response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
////            }
//        }

        if (token != null) { // Chỉ kiểm tra nếu token có
            try {
                if (jwtService.validateToken(token)) {
                    String username = jwtService.getUsernameFromToken(token);

                    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails user = userDetailsService.loadUserByUsername(username);
                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                } else {
                    // Token invalid
//                    SecurityContextHolder.clearContext();
                    clearJwtCookie(response);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Token invalid");
//                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token invalid");
                    return;
                }
            } catch (ExpiredJwtException ex) {
//                SecurityContextHolder.clearContext();
                clearJwtCookie(response);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token expired");
                return;
            }
        }



        filterChain.doFilter(request, response);
    }

    private void clearJwtCookie(HttpServletResponse response) {
        ResponseCookie clearCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, clearCookie.toString());
    }
}
