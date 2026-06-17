import { createSignal, Show } from 'solid-js'
import ColorTokenInput from './ColorTokenInput'
import DimensionTokenInput from './DimensionTokenInput'
import FontFamilyInput from './FontFamilyInput'
import TypographyTokenInput from './TypographyTokenInput'
import { formatTokenValue } from '../lib/dtcg-spec'

/**
 * Single token row — delegates to type-specific input component.
 */
export default function TokenItemEditor(props) {
  const [editingName, setEditingName] = createSignal(false)
  const [nameDraft, setNameDraft] = createSignal(props.tokenName)

  const type = () => props.groupType || props.token.$type || 'string'
  const tokenValue = () => props.token.$value

  const handleValueChange = (newValue) => {
    props.onUpdate(props.tokenName, { $value: newValue })
  }

  const handleDescriptionChange = (e) => {
    props.onUpdate(props.tokenName, { $description: e.target.value })
  }

  const handleNameBlur = () => {
    const newName = nameDraft().trim()
    if (newName && newName !== props.tokenName) {
      props.onUpdate(props.tokenName, { newName })
    }
    setEditingName(false)
  }

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') handleNameBlur()
    if (e.key === 'Escape') {
      setNameDraft(props.tokenName)
      setEditingName(false)
    }
  }

  const renderValueInput = () => {
    switch (type()) {
      case 'color':
        return <ColorTokenInput value={tokenValue()} onChange={handleValueChange} />

      case 'dimension':
      case 'fontSize':
        return <DimensionTokenInput value={tokenValue()} onChange={handleValueChange} />

      case 'fontFamily':
        return <FontFamilyInput value={tokenValue()} onChange={handleValueChange} />

      case 'typography':
        return <TypographyTokenInput value={tokenValue()} onChange={handleValueChange} />

      case 'fontWeight':
        return (
          <select
            value={tokenValue()}
            onChange={(e) => handleValueChange(parseInt(e.target.value))}
            class="rounded border border-gray-300 px-2 py-1 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
          >
            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(w => (
              <option value={w}>{w}</option>
            ))}
          </select>
        )

      case 'number':
        return (
          <input
            type="number"
            value={tokenValue()}
            onInput={(e) => handleValueChange(parseFloat(e.target.value) || 0)}
            class="w-24 rounded border border-gray-300 px-2.5 py-1 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        )

      default:
        return (
          <input
            type="text"
            value={formatTokenValue(type(), tokenValue())}
            onInput={(e) => handleValueChange(e.target.value)}
            class="w-40 rounded border border-gray-300 px-2.5 py-1 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        )
    }
  }

  return (
    <div class="group rounded-lg border border-gray-100 bg-white p-3 hover:border-gray-200 hover:shadow-sm transition-all">
      <div class="flex items-center gap-3">
        {/* Token Name */}
        <div class="w-36 shrink-0">
          <Show
            when={editingName()}
            fallback={
              <button
                class="font-mono text-sm font-medium text-gray-800 truncate block w-full text-left hover:text-blue-600 transition-colors"
                onClick={() => { setNameDraft(props.tokenName); setEditingName(true) }}
                title="Click to rename"
              >
                {props.tokenName}
              </button>
            }
          >
            <input
              type="text"
              value={nameDraft()}
              onInput={(e) => setNameDraft(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              class="w-full rounded border border-blue-300 px-1.5 py-0.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-400 bg-blue-50"
              // eslint-disable-next-line solidjs/jsx-no-undef
              ref={(el) => el?.focus()}
            />
          </Show>
        </div>

        {/* Value Input */}
        <div class="flex-1">
          {renderValueInput()}
        </div>

        {/* Description Toggle */}
        <Show when={props.showDescription !== false}>
          <button
            class="shrink-0 rounded p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={props.onToggleDescription}
            title={props.token.$description || 'Add description'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>
        </Show>

        {/* Delete Button */}
        <button
          class="shrink-0 rounded p-1 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
          onClick={() => props.onDelete(props.tokenName)}
          title="Delete token"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Description Field (expandable) */}
      <Show when={props.expanded}>
        <div class="mt-2">
          <input
            type="text"
            value={props.token.$description || ''}
            onInput={handleDescriptionChange}
            class="w-full rounded border border-gray-200 px-2.5 py-1 text-xs text-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Token description..."
          />
        </div>
      </Show>
    </div>
  )
}
