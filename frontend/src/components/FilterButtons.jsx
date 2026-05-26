function FilterButtons({ options, selectedValue, onChange, className = '' }) {
  return (
    <div className={`filter-actions ${className}`}>
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          className={selectedValue === option.value ? 'active' : ''}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default FilterButtons