package com.codegym.auto_marketing_server.controller.user;

import com.codegym.auto_marketing_server.dto.UserProfileDTO;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable(name = "id") Long id){
        Optional<User> userOptional = userService.findById(id);
        if(userOptional.isEmpty()){
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "USER_NOT_FOUND"));
        }
        User user = userOptional.get();
        UserProfileDTO dto = UserProfileDTO.from(user);
        return ResponseEntity.ok(Map.of("success", true, "profile", dto));
    }

    @PutMapping()
    public ResponseEntity<?> updateUserProfile(@RequestBody UserProfileDTO userProfile,
                                            Authentication authentication){
        User currentUser = (User) authentication.getPrincipal();

        if (!currentUser.getId().equals(userProfile.id())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "error", "FORBIDDEN"));
        }

        Optional<User> userOptional = userService.findById(userProfile.id());
        if(userOptional.isEmpty()){
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "USER_NOT_FOUND"));
        }

        User user = userOptional.get();
        user.setAvatar(userProfile.avatar());
        user.setName(userProfile.name());
        user.setDescription(userProfile.description());
        user.setJob(userProfile.job());
        user.setPhone(userProfile.phone());

        userService.updateUserProfile(user);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
