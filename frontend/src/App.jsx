import { useEffect, useState } from 'react'
import './App.css'
import ServiceCard from './components/ServiceCard'
import SummaryCard from './components/SummaryCard'
import AppointmentCard from './components/AppointmentCard'
import OperatorCard from './components/OperatorCard'
import QueueCard from './components/QueueCard'
import FilterButtons from './components/FilterButtons'

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...')
  const [services, setServices] = useState([])
  const [appointments, setAppointments] = useState([])
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingMessageType, setBookingMessageType] = useState('')
  const [appointmentFilter, setAppointmentFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('ALL')

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    serviceId: '',
    appointmentDate: '',
    appointmentTime: '',
  })

  function loadAppointments() {
    fetch('http://localhost:8080/api/appointments')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Appointments API failed')
        }

        return response.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setAppointments(data)
        } else {
          setAppointments([])
        }
      })
      .catch(() => {
        setAppointments([])
      })
  }

  useEffect(() => {
    fetch('http://localhost:8080/api/health')
      .then((response) => response.json())
      .then((data) => {
        setBackendStatus(`${data.app} backend is ${data.status}`)
      })
      .catch(() => {
        setBackendStatus('Backend is offline')
      })

    fetch('http://localhost:8080/api/services')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Services API failed')
        }

        return response.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data)
        } else {
          setServices([])
        }
      })
      .catch(() => {
        setServices([])
      })

    loadAppointments()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    fetch('http://localhost:8080/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        serviceId: Number(formData.serviceId),
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          throw new Error('Please check the appointment details.')
        }

        if (response.status === 404) {
          throw new Error('Selected service does not exist.')
        }

        if (response.status === 409) {
          throw new Error('This time slot is already booked.')
        }

        if (!response.ok) {
          throw new Error('Could not create appointment.')
        }

        return response.json()
      })
      .then((data) => {
        setBookingMessage(`${data.status}: ${data.message}`)
        setBookingMessageType('success')

        setFormData({
          customerName: '',
          customerEmail: '',
          serviceId: '',
          appointmentDate: '',
          appointmentTime: '',
        })

        loadAppointments()
      })
      .catch((error) => {
        setBookingMessage(error.message)
        setBookingMessageType('error')
      })
  }

  function updateAppointmentStatus(id, status) {
    fetch(`http://localhost:8080/api/appointments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Status update failed')
        }

        return response.json()
      })
      .then(() => {
        setBookingMessage('Appointment status updated.')
        setBookingMessageType('success')
        loadAppointments()
      })
      .catch(() => {
        setBookingMessage('Could not update appointment status')
        setBookingMessageType('error')
      })
  }

  function getDateString(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  function getTodayString() {
    return getDateString(new Date())
  }

  function getTomorrowString() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    return getDateString(tomorrow)
  }

  const dateFilteredAppointments = appointments.filter((appointment) => {
    if (dateFilter === 'ALL') {
      return true
    }

    if (dateFilter === 'TODAY') {
      return appointment.appointmentDate === getTodayString()
    }

    if (dateFilter === 'TOMORROW') {
      return appointment.appointmentDate === getTomorrowString()
    }

    return true
  })

  const activeAppointments = dateFilteredAppointments
    .filter((appointment) =>
      ['CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS'].includes(
        appointment.status?.trim().toUpperCase()
      )
    )
    .sort((firstAppointment, secondAppointment) => {
      const firstDateTime = `${firstAppointment.appointmentDate}T${firstAppointment.appointmentTime}`
      const secondDateTime = `${secondAppointment.appointmentDate}T${secondAppointment.appointmentTime}`

      return new Date(firstDateTime) - new Date(secondDateTime)
    })

  const completedAppointments = dateFilteredAppointments.filter(
    (appointment) => appointment.status === 'COMPLETED'
  )

  const noShowAppointments = dateFilteredAppointments.filter(
    (appointment) => appointment.status === 'NO_SHOW'
  )

  function sortAppointmentsByDateTime(appointmentList) {
    return [...appointmentList].sort((firstAppointment, secondAppointment) => {
      const firstDateTime = `${firstAppointment.appointmentDate}T${firstAppointment.appointmentTime}`
      const secondDateTime = `${secondAppointment.appointmentDate}T${secondAppointment.appointmentTime}`

      return new Date(firstDateTime) - new Date(secondDateTime)
    })
  }

  const waitingAppointments = sortAppointmentsByDateTime(
    dateFilteredAppointments.filter((appointment) =>
      ['CONFIRMED', 'CHECKED_IN'].includes(appointment.status)
    )
  )

  const inProgressAppointments = sortAppointmentsByDateTime(
    dateFilteredAppointments.filter(
      (appointment) => appointment.status === 'IN_PROGRESS'
    )
  )

  const closedAppointments = sortAppointmentsByDateTime(
    dateFilteredAppointments.filter((appointment) =>
      ['COMPLETED', 'NO_SHOW', 'CANCELLED'].includes(appointment.status)
    )
  )

  const displayedAppointments = dateFilteredAppointments.filter((appointment) => {
    const status = appointment.status?.trim().toUpperCase()

    if (appointmentFilter === 'ALL') {
      return true
    }

    if (appointmentFilter === 'ACTIVE') {
      return ['CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS'].includes(status)
    }

    return status === appointmentFilter
  })

  function formatStatus(status) {
    const labels = {
      CONFIRMED: 'Confirmed',
      CHECKED_IN: 'Checked in',
      IN_PROGRESS: 'In progress',
      COMPLETED: 'Completed',
      NO_SHOW: 'No-show',
      CANCELLED: 'Cancelled',
    }

    return labels[status] ?? status
  }

  function renderStatusActions(appointment) {
    const status = appointment.status

    if (status === 'CONFIRMED') {
      return (
        <>
          <button
            type="button"
            onClick={() => updateAppointmentStatus(appointment.id, 'CHECKED_IN')}
          >
            Check in
          </button>

          <button
            type="button"
            className="danger"
            onClick={() => updateAppointmentStatus(appointment.id, 'NO_SHOW')}
          >
            No-show
          </button>

          <button
            type="button"
            className="danger"
            onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
          >
            Cancel
          </button>
        </>
      )
    }

    if (status === 'CHECKED_IN') {
      return (
        <>
          <button
            type="button"
            onClick={() => updateAppointmentStatus(appointment.id, 'IN_PROGRESS')}
          >
            Start
          </button>

          <button
            type="button"
            className="danger"
            onClick={() => updateAppointmentStatus(appointment.id, 'NO_SHOW')}
          >
            No-show
          </button>

          <button
            type="button"
            className="danger"
            onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
          >
            Cancel
          </button>
        </>
      )
    }

    if (status === 'IN_PROGRESS') {
      return (
        <button
          type="button"
          onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
        >
          Complete
        </button>
      )
    }

    return null
  }

  const dateFilterOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Today', value: 'TODAY' },
    { label: 'Tomorrow', value: 'TOMORROW' },
  ]

  const appointmentFilterOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'No-show', value: 'NO_SHOW' },
  ]

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Smart Queue & Appointment Manager</p>

        <h1>NextUp</h1>

        <p className="description">
          NextUp helps small businesses manage appointments, live queues,
          delays and walk-in customers from a simple dashboard.
        </p>

        <div className="status-card">
          API status: <strong>{backendStatus}</strong>
        </div>

        <div className="actions">
          <button type="button">View Live Queue</button>
          <button type="button" className="secondary">
            Book Appointment
          </button>
        </div>
      </section>

      <section className="services-section">
        <div className="section-heading">
          <p className="eyebrow">Available services</p>
          <h2>Bookable services</h2>
        </div>

        <div className="services-grid">
          {services.length === 0 ? (
            <p className="empty-message">No services available right now.</p>
          ) : (
            services.map((service) => (
              <ServiceCard service={service} key={service.id} />
            ))
          )}
        </div>
      </section>

      <section className="booking-section">
        <div className="section-heading">
          <p className="eyebrow">Create appointment</p>
          <h2>Book a service</h2>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="customerName"
            placeholder="Your name"
            value={formData.customerName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="customerEmail"
            placeholder="Your email"
            value={formData.customerEmail}
            onChange={handleChange}
            required
          />

          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option value={service.id} key={service.id}>
                {service.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          />

          <button type="submit">Create Appointment</button>
        </form>

        {bookingMessage && (
          <div className={`booking-message ${bookingMessageType}`}>
            {bookingMessage}
          </div>
        )}
      </section>

      <section className="date-filter-section">
        <FilterButtons
          options={dateFilterOptions}
          selectedValue={dateFilter}
          onChange={setDateFilter}
          className="date-filter-actions"
        />
      </section>

      <section className="summary-section">
        <SummaryCard
          label="Active appointments"
          value={activeAppointments.length}
        />

        <SummaryCard
          label="Completed"
          value={completedAppointments.length}
        />

        <SummaryCard
          label="No-shows"
          value={noShowAppointments.length}
        />
      </section>

      <section className="operator-board-section">
        <div className="section-heading">
          <p className="eyebrow">Operator dashboard</p>
          <h2>Appointment workflow</h2>
          <p className="section-description">
            Track appointments by operational status: waiting, currently in
            progress, or already closed.
          </p>
        </div>

        <div className="operator-board">
          <div className="operator-column">
            <h3>Waiting</h3>
            
            {waitingAppointments.length === 0 ? (
              <p className="empty-message">No waiting appointments.</p>
            ) : (
              waitingAppointments.map((appointment) => (
                <OperatorCard
                  key={appointment.id}
                  appointment={appointment}
                  formatStatus={formatStatus}
                />
              ))
            )}
          </div>

          <div className="operator-column">
            <h3>In progress</h3>

            {inProgressAppointments.length === 0 ? (
              <p className="empty-message">No appointments in progress.</p>
            ) : (
              inProgressAppointments.map((appointment) => (
                <OperatorCard
                  key={appointment.id}
                  appointment={appointment}
                  formatStatus={formatStatus}
                />
              ))
            )}
          </div>

          <div className="operator-column">
            <h3>Closed</h3>

            {closedAppointments.length === 0 ? (
              <p className="empty-message">No closed appointments.</p>
            ) : (
              closedAppointments.map((appointment) => (
                <OperatorCard
                  key={appointment.id}
                  appointment={appointment}
                  formatStatus={formatStatus}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="queue-section">
        <div className="section-heading">
          <p className="eyebrow">Active workflow</p>
          <h2>Live queue</h2>
          <p className="section-description">
            Active appointments ordered by date and time. Completed, cancelled
            and no-show appointments are removed from this queue.
          </p>
        </div>

        <div className="queue-list">
          {activeAppointments.length === 0 ? (
            <p className="empty-message">No active appointments in queue.</p>
          ) : (
            activeAppointments.map((appointment, index) => (
              <QueueCard
                key={appointment.id}
                appointment={appointment}
                position={index + 1}
                formatStatus={formatStatus}
              />
            ))
          )}
        </div>
      </section>

      <section className="appointments-section">
        <div className="section-heading">
          <p className="eyebrow">Appointment history</p>
          <h2>Saved appointments</h2>
          <p className="section-description">
            Full appointment history loaded from PostgreSQL. Use filters to
            inspect active, completed or no-show records.
          </p>
        </div>

        <FilterButtons
          options={appointmentFilterOptions}
          selectedValue={appointmentFilter}
          onChange={setAppointmentFilter}
        />

        <div className="appointments-list">
          {displayedAppointments.length === 0 ? (
            <p className="empty-message">No appointments found.</p>
          ) : (
            displayedAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                formatStatus={formatStatus}
                renderStatusActions={renderStatusActions}
              />
            ))
          )}
        </div>
      </section>
    </main>
  )
}

export default App