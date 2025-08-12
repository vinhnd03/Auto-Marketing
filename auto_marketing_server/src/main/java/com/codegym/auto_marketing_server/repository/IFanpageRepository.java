package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Fanpage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IFanpageRepository extends JpaRepository<Fanpage,Long> {
}
