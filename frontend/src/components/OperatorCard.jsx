function OperatorCard({ appointment, formatStatus }) {
  return (
    <article className="operator-card">
      <div>
        <h3>{appointment.customerName}</h3>
        <p>
          {appointment.appointmentDate} · {appointment.appointmentTime}
        </p>
      </div>

      <span className="status-pill">{formatStatus(appointment.status)}</span>
    </article>
  )
}

export default OperatorCard