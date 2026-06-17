import { createSignal, createEffect, on } from 'solid-js'

/**
 * Typography token input: composite form with fontFamily, fontSize,
 * fontWeight, lineHeight, and letterSpacing fields.
 */
export default function TypographyTokenInput(props) {
  const value = () => {
    const v = props.value
    if (typeof v === 'object' && v !== null) return v
    return {
      fontFamily: 'Inter',
      fontSize: { value: 16, unit: 'px' },
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0,
    }
  }

  const update = (field, fieldValue) => {
    const current = typeof props.value === 'object' && props.value !== null ? { ...props.value } : {}
    current[field] = fieldValue
    props.onChange(current)
  }

  const fsValue = () => {
    const fs = value().fontSize
    if (typeof fs === 'object' && fs !== null) return fs
    return { value: parseFloat(fs) || 16, unit: 'px' }
  }

  return (
    <div class="grid grid-cols-2 gap-2">
      {/* Font Family */}
      <div class="col-span-2">
        <label class="block text-xs text-gray-400 mb-0.5">Font Family</label>
        <input
          type="text"
          value={value().fontFamily || ''}
          onInput={(e) => update('fontFamily', e.target.value)}
          class="w-full rounded border border-gray-300 px-2.5 py-1 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Inter"
        />
      </div>

      {/* Font Size */}
      <div>
        <label class="block text-xs text-gray-400 mb-0.5">Font Size</label>
        <div class="flex items-center gap-1">
          <input
            type="number"
            value={fsValue().value}
            onInput={(e) => update('fontSize', { value: parseFloat(e.target.value) || 16, unit: fsValue().unit })}
            class="w-16 rounded border border-gray-300 px-2 py-1 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            min="1"
          />
          <select
            value={fsValue().unit}
            onChange={(e) => update('fontSize', { value: fsValue().value, unit: e.target.value })}
            class="rounded border border-gray-300 px-1 py-1 text-sm text-gray-600 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
          >
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="pt">pt</option>
          </select>
        </div>
      </div>

      {/* Font Weight */}
      <div>
        <label class="block text-xs text-gray-400 mb-0.5">Weight</label>
        <select
          value={value().fontWeight || 400}
          onChange={(e) => update('fontWeight', parseInt(e.target.value))}
          class="w-full rounded border border-gray-300 px-2 py-1 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
        >
          <option value="100">100 Thin</option>
          <option value="200">200 Extra Light</option>
          <option value="300">300 Light</option>
          <option value="400">400 Normal</option>
          <option value="500">500 Medium</option>
          <option value="600">600 Semi Bold</option>
          <option value="700">700 Bold</option>
          <option value="800">800 Extra Bold</option>
          <option value="900">900 Black</option>
        </select>
      </div>

      {/* Line Height */}
      <div>
        <label class="block text-xs text-gray-400 mb-0.5">Line Height</label>
        <input
          type="number"
          value={value().lineHeight ?? 1.5}
          onInput={(e) => update('lineHeight', parseFloat(e.target.value) || 1.5)}
          class="w-full rounded border border-gray-300 px-2.5 py-1 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          step="0.1"
          min="0.5"
        />
      </div>

      {/* Letter Spacing */}
      <div>
        <label class="block text-xs text-gray-400 mb-0.5">Letter Spacing (em)</label>
        <input
          type="number"
          value={value().letterSpacing ?? 0}
          onInput={(e) => update('letterSpacing', parseFloat(e.target.value) || 0)}
          class="w-full rounded border border-gray-300 px-2.5 py-1 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          step="0.01"
        />
      </div>
    </div>
  )
}
