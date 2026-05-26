package com.nextup.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private String customerEmail;

    private Long serviceId;

    private String appointmentDate;

    private String appointmentTime;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    public Appointment() {
    }

    public Appointment(
            String customerName,
            String customerEmail,
            Long serviceId,
            String appointmentDate,
            String appointmentTime,
            AppointmentStatus status
    ) {
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.serviceId = serviceId;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
}