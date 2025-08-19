package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.Campaign;
import com.codegym.auto_marketing_server.repository.ICampaignRepository;
import com.codegym.auto_marketing_server.service.ICampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService implements ICampaignService {
    private final ICampaignRepository campaignRepository;

    @Override
    public List<Campaign> findAll() {
        return campaignRepository.findAll();
    }
}
