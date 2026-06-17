import { createSignal, For, Show } from 'solid-js'
import { getRules, addRule, removeRule, updateRule, moveRule } from '../lib/store'

/**
 * Rules editor — manage Do's and Don'ts for DESIGN.md.
 */
export default function RulesEditor() {
  const rules = () => getRules()
  const [newRuleType, setNewRuleType] = createSignal('do')
  const [newRuleText, setNewRuleText] = createSignal('')
  const [editingIndex, setEditingIndex] = createSignal(-1)
  const [editText, setEditText] = createSignal('')

  const handleAdd = () => {
    const text = newRuleText().trim()
    if (!text) return
    addRule(newRuleType(), text)
    setNewRuleText('')
  }

  const handleAddKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  const handleStartEdit = (index) => {
    setEditingIndex(index)
    setEditText(rules()[index].description)
  }

  const handleSaveEdit = () => {
    const text = editText().trim()
    if (text && editingIndex() >= 0) {
      updateRule(editingIndex(), { description: text })
    }
    setEditingIndex(-1)
    setEditText('')
  }

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveEdit()
    if (e.key === 'Escape') {
      setEditingIndex(-1)
      setEditText('')
    }
  }

  const handleToggleType = (index) => {
    const rule = rules()[index]
    updateRule(index, { type: rule.type === 'do' ? 'dont' : 'do' })
  }

  const handleMoveUp = (index) => {
    if (index > 0) moveRule(index, index - 1)
  }

  const handleMoveDown = (index) => {
    if (index < rules().length - 1) moveRule(index, index + 1)
  }

  return (
    <div class="mx-auto max-w-2xl space-y-4 p-6">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Design Rules</h2>
        <p class="text-sm text-gray-500">
          Define Do's and Don'ts for your design system. These appear as rules in the generated DESIGN.md.
        </p>
      </div>

      {/* Add Rule Form */}
      <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div class="flex items-start gap-3">
          <select
            value={newRuleType()}
            onChange={(e) => setNewRuleType(e.target.value)}
            class="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          >
            <option value="do">✅ Do</option>
            <option value="dont">🚫 Don't</option>
          </select>
          <input
            type="text"
            value={newRuleText()}
            onInput={(e) => setNewRuleText(e.target.value)}
            onKeyDown={handleAddKeyDown}
            class="flex-1 rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Describe the rule..."
          />
          <button
            class="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      </div>

      {/* Rules List */}
      <Show
        when={rules().length > 0}
        fallback={
          <div class="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
            <p class="text-gray-400">No rules yet. Add one above.</p>
          </div>
        }
      >
        <div class="space-y-2">
          <For each={rules()}>
            {(rule, index) => (
              <div
                class="group flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 hover:border-gray-200 shadow-sm transition-all"
                classList={{
                  'border-l-4 border-l-green-400': rule.type === 'do',
                  'border-l-4 border-l-red-400': rule.type === 'dont',
                }}
              >
                {/* Type Badge */}
                <button
                  class="shrink-0 text-xs font-medium cursor-pointer"
                  onClick={() => handleToggleType(index())}
                  title="Click to toggle"
                >
                  {rule.type === 'do' ? '✅ Do' : '🚫 Don\'t'}
                </button>

                {/* Rule Text */}
                <div class="flex-1 min-w-0">
                  <Show
                    when={editingIndex() === index()}
                    fallback={
                      <p
                        class="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleStartEdit(index())}
                      >
                        {rule.description}
                      </p>
                    }
                  >
                    <input
                      type="text"
                      value={editText()}
                      onInput={(e) => setEditText(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleEditKeyDown}
                      class="w-full rounded border border-blue-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      // eslint-disable-next-line solidjs/jsx-no-undef
                      ref={(el) => el?.focus()}
                    />
                  </Show>
                </div>

                {/* Actions */}
                <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    class="rounded p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                    onClick={() => handleMoveUp(index())}
                    title="Move up"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                  <button
                    class="rounded p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                    onClick={() => handleMoveDown(index())}
                    title="Move down"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <button
                    class="rounded p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    onClick={() => removeRule(index())}
                    title="Delete rule"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}
