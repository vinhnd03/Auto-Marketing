package com.codegym.auto_marketing_server.controller.publish;

import com.codegym.auto_marketing_server.entity.Fanpage;
import com.codegym.auto_marketing_server.service.impl.FanpageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fanpages")
@RequiredArgsConstructor
public class FanpageController {
    private final FanpageService fanpageService;
    // Đồng bộ fanpage từ Facebook (dùng user access token đã lưu trong SocialAccount)
    @PostMapping("/sync")
    public ResponseEntity<List<Fanpage>> sync(@RequestParam Long userId){
        return ResponseEntity.ok(fanpageService.syncUserPages(userId));
    }

    //Lấy danh sách fanpage của user
    @GetMapping
    public ResponseEntity<List<Fanpage>> list(@RequestParam Long userId) {
        return ResponseEntity.ok(fanpageService.listByUser(userId));
    }
}
