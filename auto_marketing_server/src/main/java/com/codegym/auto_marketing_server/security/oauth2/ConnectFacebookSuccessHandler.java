//package com.codegym.auto_marketing_server.security.oauth2;
//
//import com.codegym.auto_marketing_server.entity.User;
//import com.codegym.auto_marketing_server.service.ISocialAccountService;
//import com.codegym.auto_marketing_server.service.IUserService;
//import com.codegym.auto_marketing_server.service.impl.facebook.FacebookService;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
//import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//import java.util.Map;
//
//@Component
//@RequiredArgsConstructor
//public class ConnectFacebookSuccessHandler implements AuthenticationSuccessHandler {
//
//    private final ISocialAccountService socialAccountService;
//    private final IUserService userService;
//    private final FacebookService facebookService;
//
//    @Value("${app.frontend.url}")
//    private String frontendUrl;
//
//    @Override
//    public void onAuthenticationSuccess(HttpServletRequest request,
//                                        HttpServletResponse response,
//                                        Authentication authentication) throws IOException {
//
//        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
//
//        // Lấy user hiện tại login app
//        User currentUser = userService.getCurrentUser();
//        if (currentUser == null) {
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not logged in to app");
//            return;
//        }
//
//        // Lấy access token từ Spring Security OAuth2 client
//        String accessToken = facebookService.getAccessToken(oauthToken);
//
//        // Lấy thông tin user Facebook
//        Map<String, Object> fbUser = facebookService.getUserInfo(accessToken);
//        String providerId = fbUser.get("id").toString();
//        String name = fbUser.get("name").toString();
//
//        // Lưu vào socialAccounts
//        socialAccountService.saveFacebookAccount(currentUser, accessToken, name, providerId);
//
//        response.sendRedirect(frontendUrl + "/facebook-connected");
//    }
//}
