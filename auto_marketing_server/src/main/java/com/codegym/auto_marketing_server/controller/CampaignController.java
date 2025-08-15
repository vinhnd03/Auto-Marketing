package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.entity.Campaign;
import com.codegym.auto_marketing_server.service.ICampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/campaigns")
@RequiredArgsConstructor
@CrossOrigin("*")
@Slf4j
@Tag(name = "Campaigns", description = "Campaign Management")
public class CampaignController {

    private final ICampaignService campaignService;

    @GetMapping
    @Operation(
            summary = "Get all campaigns",
            description = "Retrieve all campaigns in the system",
            responses = {
                    @ApiResponse(responseCode = "200", description = "List of campaigns returned successfully"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<List<Campaign>> getAllCampaigns() {
        log.info("📦 Fetching all campaigns");
        List<Campaign> campaigns = campaignService.findAll();
        return ResponseEntity.ok(campaigns);
    }
}