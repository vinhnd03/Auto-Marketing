package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.repository.IFanpageRepository;
import com.codegym.auto_marketing_server.service.IFanpageService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class FanpageService implements IFanpageService {
    private final IFanpageRepository fanpageRepository;
}
