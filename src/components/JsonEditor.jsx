import { createSignal, createEffect, on } from 'solid-js'
import { getTokens, getMeta, getRules, importFromJSON, resetStore } from '../lib/store'

/**
 * Raw JSON editor tab — displays and edits the full W3C DTCG JSON.
 * On valid edit, imports back to the store.
 */
export default function JsonEditor() {
  const [jsonText, setJsonText] = createSignal('')
  const [error, setError] = createSignal('')
  const [successMsg, setSuccessMsg] = createSignal('')

  // Build the full JSON from store
  const buildJSON = () => {
    const data = {
      meta: getMeta(),
      tokens: getTokens(),
      rules: getRules(),
    }
    return JSON.stringify(data, null, 2)
  }

  // Initial load and sync from store
  setJsonText(buildJSON())

  // Listen for external store changes (e.g., from visual editor)
  createEffect(on(() => [getMeta(), getTokens(), getRules()], () => {
    // Only update if the JSON editor doesn't have focus
    setJsonText(buildJSON())
  }, { defer: true }))

  const handleInput = (e) => {
    setJsonText(e.target.value)
    setError('')
    setSuccessMsg('')
  }

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText())
      const success = importFromJSON(parsed)
      if (success) {
        setError('')
        setSuccessMsg('✓ JSON applied successfully')
        setTimeout(() => setSuccessMsg(''), 2000)
      } else {
        setError('Failed to import JSON (check structure)')
      }
    } catch (e) {
      setError(`Parse error: ${e.message}`)
    }
  }

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText())
      setJsonText(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (e) {
      setError(`Cannot format invalid JSON: ${e.message}`)
    }
  }

  const handleReset = () => {
    if (confirm('Reset all tokens, meta, and rules to defaults?')) {
      resetStore()
      setJsonText(buildJSON())
      setError('')
      setSuccessMsg('Reset to defaults')
      setTimeout(() => setSuccessMsg(''), 2000)
    }
  }

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to apply
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleApply()
    }
    // Tab to insert spaces
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.target
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newText = jsonText().substring(0, start) + '  ' + jsonText().substring(end)
      setJsonText(newText)
      // Restore cursor position after render
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      })
    }
  }

  return (
    <div class="mx-auto max-w-4xl space-y-4 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">JSON Editor</h2>
          <p class="text-sm text-gray-500">
            Edit the raw W3C DTCG JSON. Press <kbd class="rounded border border-gray-300 bg-gray-100 px-1 text-xs">Ctrl+Enter</kbd> to apply.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={handleFormat}
          >
            Format
          </button>
          <button
            class="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            onClick={handleApply}
          >
            Apply
          </button>
          <button
            class="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Success / Error Messages */}
      {successMsg() && (
        <div class="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{successMsg()}</div>
      )}
      {error() && (
        <div class="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 font-mono">{error()}</div>
      )}

      {/* JSON Textarea */}
      <textarea
        value={jsonText()}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        class="h-[calc(100vh-260px)] w-full rounded-xl border border-gray-300 bg-white p-4 font-mono text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
        spellcheck={false}
      />
    </div>
  )
}
