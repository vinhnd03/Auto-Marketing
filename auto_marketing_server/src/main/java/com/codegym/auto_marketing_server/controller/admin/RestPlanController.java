package com.codegym.auto_marketing_server.controller.admin;


import com.codegym.auto_marketing_server.entity.Plan;
import com.codegym.auto_marketing_server.service.IPlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class RestPlanController {
    private final IPlanService planService;

    public RestPlanController(IPlanService planService) {
        this.planService = planService;
    }

    @GetMapping("")
    public ResponseEntity<List<Plan>> findAllBlog(){
        List<Plan> plansList=planService.getAll();
        if (plansList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); //204 thành công nhưng không có kết quả
        }
        return new ResponseEntity<>(plansList,HttpStatus.OK); //200 thành công
    }
}
