package com.nextup.backend.controller;

import com.nextup.backend.model.Appointment;
import com.nextup.backend.model.AppointmentRequest;
import com.nextup.backend.model.AppointmentResponse;
import com.nextup.backend.model.StatusUpdateRequest;
import com.nextup.backend.service.AppointmentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import java.util.List;

@RestController
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/api/appointments")
    public AppointmentResponse createAppointment(@Valid @RequestBody AppointmentRequest request) {
        return appointmentService.createAppointment(request);
    }
    
    @GetMapping("/api/appointments")
    public List<Appointment> getAppointments() {
        return appointmentService.getAppointments();
    }

    @PatchMapping("/api/appointments/{id}/status")
    public Appointment updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request
    ) {
        return appointmentService.updateAppointmentStatus(id, request.status());
    }
}