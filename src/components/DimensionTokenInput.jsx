/**
 * Dimension token input: number + unit selector.
 * Used for spacing, border radius, font size, etc.
 */
export default function DimensionTokenInput(props) {
  const units = props.units || ['px', 'rem', 'em', '%']

  const value = () => props.value
  const numVal = () => {
    const v = value()
    if (typeof v === 'object' && v !== null) return v.value ?? 0
    return parseFloat(v) || 0
  }
  const unit = () => {
    const v = value()
    if (typeof v === 'object' && v !== null) return v.unit || 'px'
    return 'px'
  }

  const handleValueChange = (e) => {
    const num = parseFloat(e.target.value)
    if (!isNaN(num)) {
      props.onChange({ value: num, unit: unit() })
    }
  }

  const handleUnitChange = (e) => {
    props.onChange({ value: numVal(), unit: e.target.value })
  }

  return (
    <div class="flex items-center gap-1">
      <input
        type="number"
        value={numVal()}
        onInput={handleValueChange}
        class="w-20 rounded border border-gray-300 px-2.5 py-1 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        step={props.step || 1}
        min={props.min ?? 0}
      />
      <select
        value={unit()}
        onChange={handleUnitChange}
        class="rounded border border-gray-300 px-1.5 py-1 text-sm text-gray-600 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
      >
        {units.map(u => (
          <option value={u}>{u}</option>
        ))}
      </select>
    </div>
  )
}
