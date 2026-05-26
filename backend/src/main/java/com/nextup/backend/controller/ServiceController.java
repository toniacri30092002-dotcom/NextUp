package com.nextup.backend.controller;

import com.nextup.backend.model.BookableService;
import com.nextup.backend.service.BookableServiceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ServiceController {

    private final BookableServiceService bookableServiceService;

    public ServiceController(BookableServiceService bookableServiceService) {
        this.bookableServiceService = bookableServiceService;
    }

    @GetMapping("/api/services")
    public List<BookableService> getServices() {
        return bookableServiceService.getServices();
    }
}