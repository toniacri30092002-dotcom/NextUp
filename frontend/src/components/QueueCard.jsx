function QueueCard({ appointment, position, formatStatus }) {
  return (
    <article className="queue-card">
      <div className="queue-position">#{position}</div>

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
    </article>
  )
}

export default QueueCard