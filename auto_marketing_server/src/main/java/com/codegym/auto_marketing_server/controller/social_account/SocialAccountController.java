package com.codegym.auto_marketing_server.controller.social_account;

import com.codegym.auto_marketing_server.dto.SocialAccountDTO;
import com.codegym.auto_marketing_server.service.ISocialAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/social-accounts")
@RequiredArgsConstructor
public class SocialAccountController {

    private final ISocialAccountService socialAccountService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SocialAccountDTO>> getByUserId(@PathVariable Long userId) {
        List<SocialAccountDTO> list = socialAccountService.getSocialAccountsByUserId(userId);
        return ResponseEntity.ok(list);
    }
}
