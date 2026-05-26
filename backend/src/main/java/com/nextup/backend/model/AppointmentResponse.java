package com.nextup.backend.model;

public record AppointmentResponse(
        Long id,
        String status,
        String message
) {
}