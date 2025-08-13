package com.codegym.auto_marketing_server.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        mapper.getConfiguration().setSkipNullEnabled(true);
        mapper.getConfiguration().setMatchingStrategy(org.modelmapper.convention.MatchingStrategies.STRICT);

        return mapper;
    }
}
