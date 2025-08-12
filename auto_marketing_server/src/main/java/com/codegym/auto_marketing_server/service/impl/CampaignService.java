package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.repository.ICampaignRepository;
import com.codegym.auto_marketing_server.service.ICampaignService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CampaignService implements ICampaignService {
    private final ICampaignRepository campaignRepository;
}
