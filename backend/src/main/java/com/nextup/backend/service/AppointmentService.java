package com.nextup.backend.service;

import com.nextup.backend.model.Appointment;
import com.nextup.backend.model.AppointmentRequest;
import com.nextup.backend.model.AppointmentResponse;
import com.nextup.backend.model.AppointmentStatus;
import com.nextup.backend.repository.AppointmentRepository;
import com.nextup.backend.repository.BookableServiceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final BookableServiceRepository bookableServiceRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            BookableServiceRepository bookableServiceRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.bookableServiceRepository = bookableServiceRepository;
    }

    public AppointmentResponse createAppointment(AppointmentRequest request) {
        boolean serviceExists = bookableServiceRepository.existsById(request.serviceId());

        if (!serviceExists) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Bookable service not found"
            );
        }

        boolean appointmentAlreadyExists =
                appointmentRepository.existsByServiceIdAndAppointmentDateAndAppointmentTime(
                        request.serviceId(),
                        request.appointmentDate(),
                        request.appointmentTime()
                );

        if (appointmentAlreadyExists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This time slot is already booked"
            );
        }

        Appointment appointment = new Appointment(
                request.customerName(),
                request.customerEmail(),
                request.serviceId(),
                request.appointmentDate(),
                request.appointmentTime(),
                AppointmentStatus.CONFIRMED
        );

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return new AppointmentResponse(
                savedAppointment.getId(),
                savedAppointment.getStatus().name(),
                "Appointment created successfully"
        );
    }

    public List<Appointment> getAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment updateAppointmentStatus(Long id, String status) {
        AppointmentStatus appointmentStatus = parseStatus(status);

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Appointment not found"
                ));

        appointment.setStatus(appointmentStatus);

        return appointmentRepository.save(appointment);
    }

    private AppointmentStatus parseStatus(String status) {
        try {
            return AppointmentStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid appointment status"
            );
        }
    }
}