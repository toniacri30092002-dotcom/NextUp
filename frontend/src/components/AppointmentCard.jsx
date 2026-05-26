function AppointmentCard({ appointment, formatStatus, renderStatusActions }) {
  const actions = renderStatusActions(appointment)

  return (
    <article className="appointment-card">
      <div>
        <h3>{appointment.customerName}</h3>
        <p>{appointment.customerEmail}</p>
      </div>

      <div>
        <strong>{appointment.appointmentDate}</strong>
        <span>{appointment.appointmentTime}</span>
      </div>

      <span className="status-pill">
        {formatStatus(appointment.status)}
      </span>

      {actions && (
        <div className="status-actions">
          {actions}
        </div>
      )}
    </article>
  )
}

export default AppointmentCard