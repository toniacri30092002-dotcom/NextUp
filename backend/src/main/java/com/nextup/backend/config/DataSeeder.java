package com.nextup.backend.config;

import com.nextup.backend.model.BookableService;
import com.nextup.backend.repository.BookableServiceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedBookableServices(BookableServiceRepository bookableServiceRepository) {
        return args -> {
            if (bookableServiceRepository.count() == 0) {
                bookableServiceRepository.save(new BookableService(
                        "Consultation",
                        30,
                        "General appointment with an operator"
                ));

                bookableServiceRepository.save(new BookableService(
                        "Quick Service",
                        15,
                        "Short appointment for simple requests"
                ));

                bookableServiceRepository.save(new BookableService(
                        "Document Pickup",
                        10,
                        "Fast service for collecting documents"
                ));
            }
        };
    }
}