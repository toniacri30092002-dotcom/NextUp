package com.nextup.backend.repository;

import com.nextup.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    boolean existsByServiceIdAndAppointmentDateAndAppointmentTime(
            Long serviceId,
            String appointmentDate,
            String appointmentTime
    );
}