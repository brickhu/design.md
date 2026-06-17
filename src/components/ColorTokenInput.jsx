import { createSignal, createEffect, on } from 'solid-js'

/**
 * Color token input: native color picker + hex text input.
 * Supports both plain string colors and structured DTCG color objects.
 */
export default function ColorTokenInput(props) {
  // Extract hex from value (supports both string and structured)
  const getHex = (val) => {
    if (!val) return '#000000'
    if (typeof val === 'string') {
      // Handle oklch/rgb/hsl — return as-is for display, use fallback for picker
      if (val.startsWith('oklch') || val.startsWith('rgb') || val.startsWith('hsl')) return ''
      return val.startsWith('#') ? val : `#${val}`
    }
    if (val?.hex) return val.hex
    if (val?.components && val?.colorSpace === 'srgb') {
      const [r, g, b] = val.components.map(c => Math.round(c * 255))
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }
    return '#000000'
  }

  const [hexInput, setHexInput] = createSignal(getHex(props.value))
  const [pickerColor, setPickerColor] = createSignal(getHex(props.value))

  // Sync external value changes
  createEffect(on(() => props.value, (val) => {
    const hex = getHex(val)
    setHexInput(typeof val === 'string' ? val : hex)
    setPickerColor(hex)
  }))

  const handlePickerChange = (e) => {
    const hex = e.target.value
    setPickerColor(hex)
    setHexInput(hex)
    props.onChange(hex)
  }

  const handleHexInput = (e) => {
    const val = e.target.value
    setHexInput(val)
  }

  const handleHexBlur = () => {
    let val = hexInput().trim()
    if (!val) val = '#000000'
    if (!val.startsWith('#') && !val.startsWith('oklch') && !val.startsWith('rgb') && !val.startsWith('hsl')) {
      val = `#${val}`
    }
    setHexInput(val)
    if (val.startsWith('#')) setPickerColor(val)
    props.onChange(val)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleHexBlur()
    }
  }

  return (
    <div class="flex items-center gap-2">
      <div class="relative">
        <input
          type="color"
          value={pickerColor()}
          onInput={handlePickerChange}
          class="h-8 w-8 cursor-pointer rounded border border-gray-300 bg-white p-0"
          title="Pick a color"
        />
      </div>
      <input
        type="text"
        value={hexInput()}
        onInput={handleHexInput}
        onBlur={handleHexBlur}
        onKeyDown={handleKeyDown}
        class="w-36 rounded border border-gray-300 px-2.5 py-1 text-sm font-mono text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        placeholder="#000000"
      />
    </div>
  )
}
