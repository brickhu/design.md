import { createSignal, onMount, createEffect, on } from 'solid-js'
import { TOKEN_TYPES } from '../lib/dtcg-spec'

/**
 * Font family input: text input with a datalist of suggestions.
 */
export default function FontFamilyInput(props) {
  const [inputVal, setInputVal] = createSignal('')

  createEffect(on(() => props.value, (val) => {
    setInputVal(Array.isArray(val) ? val.join(', ') : (val || ''))
  }, { defer: false }))

  const handleInput = (e) => {
    setInputVal(e.target.value)
  }

  const handleBlur = () => {
    const val = inputVal().trim()
    if (!val) return
    props.onChange(val)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur()
    }
  }

  const suggestions = TOKEN_TYPES.fontFamily?.suggestions || []

  return (
    <div class="flex-1">
      <input
        type="text"
        value={inputVal()}
        onInput={handleInput}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        list="font-suggestions"
        class="w-full rounded border border-gray-300 px-2.5 py-1 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        placeholder="Inter"
      />
      <datalist id="font-suggestions">
        {suggestions.map(f => (
          <option value={f} />
        ))}
      </datalist>
    </div>
  )
}
