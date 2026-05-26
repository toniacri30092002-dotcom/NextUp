package com.nextup.backend.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AppointmentRequest(
        @NotBlank(message = "Customer name is required")
        String customerName,

        @NotBlank(message = "Customer email is required")
        @Email(message = "Customer email must be valid")
        String customerEmail,

        @NotNull(message = "Service id is required")
        Long serviceId,

        @NotBlank(message = "Appointment date is required")
        String appointmentDate,

        @NotBlank(message = "Appointment time is required")
        String appointmentTime
) {
}