function SummaryCard({ label, value }) {
  return (
    <article className="summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

export default SummaryCard