package com.nextup.backend.service;

import com.nextup.backend.model.BookableService;
import com.nextup.backend.repository.BookableServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookableServiceService {

    private final BookableServiceRepository bookableServiceRepository;

    public BookableServiceService(BookableServiceRepository bookableServiceRepository) {
        this.bookableServiceRepository = bookableServiceRepository;
    }

    public List<BookableService> getServices() {
        return bookableServiceRepository.findAll();
    }
}