package com.nextup.backend.repository;

import com.nextup.backend.model.BookableService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookableServiceRepository extends JpaRepository<BookableService, Long> {
}