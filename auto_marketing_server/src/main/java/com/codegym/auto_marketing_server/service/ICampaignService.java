package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Campaign;

import java.util.List;

public interface ICampaignService {
    List<Campaign> findAll();
}
