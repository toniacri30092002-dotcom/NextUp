function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <span>{service.durationMinutes} minutes</span>
    </article>
  )
}

export default ServiceCard