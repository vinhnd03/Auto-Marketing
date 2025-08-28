package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.CampaignDTO;
import com.codegym.auto_marketing_server.entity.Campaign;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.enums.CampaignStatus;
import com.codegym.auto_marketing_server.helper.ExcelHelper;
import com.codegym.auto_marketing_server.service.ICampaignService;
import com.codegym.auto_marketing_server.service.IWorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/campaign")
//@RequestMapping("/api/v1/campaigns")
@RequiredArgsConstructor
public class CampaignController {
    private final ICampaignService campaignService;
    private final IWorkspaceService workspaceService;


    @GetMapping("/statuses")
    public List<String> getStatuses() {
        return Arrays.stream(CampaignStatus.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    @GetMapping
    public ResponseEntity<Page<Campaign>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String name,
            @RequestParam("workspaceId") Long workspaceId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Campaign> campaignList = campaignService.findAll(name, startDate, endDate,workspaceId, pageable);
        System.out.println("startDate param = " + startDate);
        System.out.println("endDate param = " + endDate);
        if (campaignList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(campaignList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CampaignDTO dto, BindingResult bindingResult) {
        new CampaignDTO().validate(dto, bindingResult);

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        Campaign campaign = new Campaign();
        BeanUtils.copyProperties(dto, campaign);

        campaign.setCreatedAt(LocalDate.now());
        campaign.setUpdatedAt(null);
        campaign.setSoftDel(false);

        if (dto.getWorkspaceId() != null) {
            Workspace workspace = workspaceService.getWorkspaceById(dto.getWorkspaceId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Workspace"));
            campaign.setWorkspace(workspace);
        }

        Campaign savedCampaign = campaignService.save(campaign);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCampaign);
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getCampaignById(@PathVariable Long id) {
        Campaign campaign = campaignService.findById(id);
        if (campaign == null) {
            return new ResponseEntity<>("Không tìm thấy Campaign với id: " + id, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(campaign, HttpStatus.OK);
    }

    @GetMapping("/totalCampaign")
    public ResponseEntity<Integer> totalCampaign(@RequestParam("userId") Long userId) {
        int total = campaignService.countCampaignBySoftDel(userId);

        return ResponseEntity.ok(total);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @Valid @RequestBody CampaignDTO dto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        Campaign existing = campaignService.findById(id);
        if (existing == null) {
            throw new RuntimeException("Không tìm thấy Campaign với id: " + id);
        }

        BeanUtils.copyProperties(dto, existing, "id", "createdAt");
        existing.setUpdatedAt(LocalDate.now());

        if (dto.getWorkspaceId() != null) {
            Workspace workspace = workspaceService.getWorkspaceById(dto.getWorkspaceId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Workspace"));
            existing.setWorkspace(workspace);
        }

        Campaign updated = campaignService.save(existing);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCampaign(@PathVariable Long id) {
        Campaign campaign = campaignService.findById(id);
        if (campaign == null) {
            return new ResponseEntity<>("Không tìm thấy Campaign với id: " + id, HttpStatus.NOT_FOUND);
        }

        campaign.setSoftDel(true);
        campaign.setUpdatedAt(LocalDate.now());
        campaignService.save(campaign);

        return new ResponseEntity<>("Đã xóa Campaign thành công", HttpStatus.OK);
    }

    @PostMapping("/upload-excel")
    public ResponseEntity<?> uploadExcel(@RequestParam("file") MultipartFile file, @RequestParam("workspaceId") Long workspaceId) {
        if (!ExcelHelper.isExcelFile(file)) {
            return ResponseEntity.badRequest().body("File không hợp lệ, chỉ chấp nhận Excel (.xlsx)");
        }

        try {
            List<CampaignDTO> dtos = ExcelHelper.excelToCampaigns(file.getInputStream());

            Workspace workspace = workspaceService.getWorkspaceById(workspaceId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Workspace"));

            List<Campaign> savedCampaigns = new ArrayList<>();
            for (CampaignDTO dto : dtos) {
                Campaign campaign = new Campaign();
                BeanUtils.copyProperties(dto, campaign);

                campaign.setWorkspace(workspace);
                campaign.setCreatedAt(LocalDate.now());
                campaign.setUpdatedAt(null);
                campaign.setSoftDel(false);

                savedCampaigns.add(campaignService.save(campaign));
            }

            return ResponseEntity.ok(savedCampaigns);

        } catch (ExcelHelper.ExcelValidationException e) {
            return ResponseEntity.badRequest().body("Lỗi dữ liệu Excel:\n" + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }
    @GetMapping("/workspaceId")
    public ResponseEntity<List<Campaign>> getCampaignsByWorkspace(
            @RequestParam Long workspaceId
    ) {
        return ResponseEntity.ok(campaignService.getCampaignsByWorkspace(workspaceId));
    }

//    @GetMapping
//    @Operation(
//            summary = "Get all campaigns",
//            description = "Retrieve all campaigns in the system",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "List of campaigns returned successfully"),
//                    @ApiResponse(responseCode = "500", description = "Internal server error")
//            }
//    )
//    public ResponseEntity<List<Campaign>> getAllCampaigns() {
//        log.info("📦 Fetching all campaigns");
//        List<Campaign> campaigns = campaignService.findAll();
//        return ResponseEntity.ok(campaigns);
//    }
}
