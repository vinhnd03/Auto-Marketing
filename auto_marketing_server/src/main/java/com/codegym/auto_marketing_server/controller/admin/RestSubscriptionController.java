package com.codegym.auto_marketing_server.controller.admin;



import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class RestSubscriptionController {
    private final ISubscriptionService subscriptionService;

    public RestSubscriptionController(ISubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("")
    public ResponseEntity<List<Subscription>> findAllBlog(){
        List<Subscription> subscriptionsList=subscriptionService.findAll();
        if (subscriptionsList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); //204 thành công nhưng không có kết quả
        }
        return new ResponseEntity<>(subscriptionsList,HttpStatus.OK); //200 thành công
    }
}
