package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.dto.FanpageDTO;

import java.util.List;

public interface IFanpageService {
    List<FanpageDTO> getByUserId(Long userId);

}
