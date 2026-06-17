import { createSignal, Show, Switch, Match, onMount } from 'solid-js'
import ColorTokenInput from './ColorTokenInput'
import DimensionTokenInput from './DimensionTokenInput'
import FontFamilyInput from './FontFamilyInput'
import { addToken, addTokenGroup, getTokens } from '../lib/store'
import { createDefaultValue, EDITOR_GROUPS } from '../lib/dtcg-spec'

/**
 * Token type options shown in step 1.
 * Each maps to an EDITOR_GROUPS entry.
 */
const TOKEN_TYPE_OPTIONS = [
  {
    key: 'color',
    label: 'Color',
    icon: '🎨',
    desc: 'Color palette tokens',
    groupKey: 'color',
  },
  {
    key: 'spacing',
    label: 'Spacing',
    icon: '📏',
    desc: 'Spacing and layout tokens',
    groupKey: 'spacing',
  },
  {
    key: 'borderRadius',
    label: 'Border Radius',
    icon: '⭕',
    desc: 'Corner rounding tokens',
    groupKey: 'borderRadius',
  },
  {
    key: 'fontSize',
    label: 'Font Size',
    icon: '📐',
    desc: 'Font size scale tokens',
    groupKey: 'fontSize',
  },
  {
    key: 'fontFamily',
    label: 'Font Family',
    icon: '🔤',
    desc: 'Font family tokens',
    groupKey: 'fontFamily',
  },
]

/**
 * Two-step modal for adding a new design token.
 *
 * Step 1 — Type selection: user picks the kind of token to create.
 * Step 2 — Editor: visual editor (color picker / dimension inputs / font picker)
 *           plus a name input and description field.
 *
 * If `preSelectedGroupKey` is provided, step 1 is skipped and the editor
 * opens directly for that group's type.
 */
export default function AddTokenModal(props) {
  const [step, setStep] = createSignal(props.preSelectedGroupKey ? 'editor' : 'type')
  const [selectedOption, setSelectedOption] = createSignal(null)
  const [tokenName, setTokenName] = createSignal('')
  const [tokenValue, setTokenValue] = createSignal(null)
  const [tokenDescription, setTokenDescription] = createSignal('')
  const [nameError, setNameError] = createSignal('')

  // Resolve pre-selected group on mount
  onMount(() => {
    if (props.preSelectedGroupKey) {
      const opt = TOKEN_TYPE_OPTIONS.find(o => o.groupKey === props.preSelectedGroupKey)
      if (opt) {
        setSelectedOption(opt)
        const groupDef = EDITOR_GROUPS.find(g => g.key === opt.groupKey)
        if (groupDef) {
          setTokenValue(createDefaultValue(groupDef.type))
        }
      }
    }
  })

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleSelectType = (option) => {
    setSelectedOption(option)
    const groupDef = EDITOR_GROUPS.find(g => g.key === option.groupKey)
    if (groupDef) {
      setTokenValue(createDefaultValue(groupDef.type))
    }
    setStep('editor')
  }

  const handleBackToType = () => {
    setStep('type')
    setTokenName('')
    setNameError('')
  }

  const handleValueChange = (newValue) => {
    setTokenValue(newValue)
  }

  const handleAdd = () => {
    const name = tokenName()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    if (!name) {
      setNameError('Please enter a token name')
      return
    }

    const option = selectedOption()
    if (!option) return

    const groupDef = EDITOR_GROUPS.find(g => g.key === option.groupKey)
    if (!groupDef) return

    // Ensure group exists
    const existingTokens = getTokens()
    if (!existingTokens[option.groupKey]) {
      addTokenGroup(option.groupKey, groupDef.type)
    }

    // Check for duplicate
    if (existingTokens[option.groupKey]?.[name]) {
      setNameError('A token with this name already exists')
      return
    }

    // Add token
    const success = addToken(
      option.groupKey,
      name,
      groupDef.type,
      tokenValue(),
      tokenDescription() || undefined,
    )

    if (success) {
      resetAndClose()
    }
  }

  const resetAndClose = () => {
    setStep(props.preSelectedGroupKey ? 'editor' : 'type')
    setSelectedOption(null)
    setTokenName('')
    setTokenValue(null)
    setTokenDescription('')
    setNameError('')
    if (!props.preSelectedGroupKey) {
      setSelectedOption(null)
    }
    props.onClose?.()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (step() === 'editor') handleAdd()
    }
    if (e.key === 'Escape') {
      if (step() === 'editor' && !props.preSelectedGroupKey) {
        handleBackToType()
      } else {
        resetAndClose()
      }
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      resetAndClose()
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────

  const groupType = () => {
    const option = selectedOption()
    if (!option) return 'string'
    const groupDef = EDITOR_GROUPS.find(g => g.key === option.groupKey)
    return groupDef?.type || 'string'
  }

  // ── Render ────────────────────────────────────────────────────────────

  // Determine editor type for the visual input
  const editorType = () => {
    const gt = groupType()
    if (gt === 'color') return 'color'
    if (gt === 'fontFamily') return 'fontFamily'
    // dimension, fontSize both use dimension editor
    return 'dimension'
  }

  return (
    <>
      {/* Backdrop */}
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={handleOverlayClick}
        onKeyDown={handleKeyDown}
      >
        {/* Modal */}
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          {/* Header */}
          <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div class="flex items-center gap-3">
              <Show when={step() === 'editor' && !props.preSelectedGroupKey}>
                <button
                  class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  onClick={handleBackToType}
                  title="Back to type selection"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
              </Show>
              <h2 class="text-lg font-semibold text-gray-900">
                {step() === 'type' ? 'Add Token' : `New ${selectedOption()?.label || ''} Token`}
              </h2>
            </div>
            <button
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              onClick={resetAndClose}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div class="px-6 py-5">
            <Switch>
              {/* ── Step 1: Type Selection ─────────────────────────────── */}
              <Match when={step() === 'type'}>
                <p class="mb-4 text-sm text-gray-500">
                  Choose the type of design token you want to create:
                </p>
                <div class="grid grid-cols-1 gap-2">
                  {TOKEN_TYPE_OPTIONS.map((option) => (
                    <button
                      class="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm transition-all"
                      onClick={() => handleSelectType(option)}
                    >
                      <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl">
                        {option.icon}
                      </span>
                      <div class="flex-1">
                        <div class="font-medium text-gray-900">{option.label}</div>
                        <div class="text-xs text-gray-400">{option.desc}</div>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        class="text-gray-300"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  ))}
                </div>
              </Match>

              {/* ── Step 2: Visual Editor ──────────────────────────────── */}
              <Match when={step() === 'editor'}>
                <div class="space-y-4">
                  {/* Token Name */}
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700">
                      Token Name
                    </label>
                    <input
                      type="text"
                      value={tokenName()}
                      onInput={(e) => {
                        setTokenName(e.target.value)
                        setNameError('')
                      }}
                      class={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 ${
                        nameError()
                          ? 'border-red-300 focus:border-red-400'
                          : 'border-gray-300 focus:border-blue-400'
                      }`}
                      placeholder="e.g. primary-blue, lg-spacing, body-font"
                      // eslint-disable-next-line solidjs/jsx-no-undef
                      ref={(el) => el?.focus()}
                    />
                    <Show when={nameError()}>
                      <p class="mt-1 text-xs text-red-500">{nameError()}</p>
                    </Show>
                    <p class="mt-1 text-xs text-gray-400">
                      Lowercase letters, numbers, and hyphens. Spaces become hyphens.
                    </p>
                  </div>

                  {/* Visual Editor */}
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700">
                      Value
                    </label>
                    <div class="rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-3">
                      <Switch>
                        <Match when={editorType() === 'color'}>
                          <ColorTokenInput
                            value={tokenValue()}
                            onChange={handleValueChange}
                          />
                        </Match>
                        <Match when={editorType() === 'dimension'}>
                          <DimensionTokenInput
                            value={tokenValue()}
                            onChange={handleValueChange}
                          />
                        </Match>
                        <Match when={editorType() === 'fontFamily'}>
                          <FontFamilyInput
                            value={tokenValue()}
                            onChange={handleValueChange}
                          />
                        </Match>
                      </Switch>
                    </div>
                  </div>

                  {/* Description (optional) */}
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700">
                      Description
                      <span class="ml-1 text-xs font-normal text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={tokenDescription()}
                      onInput={(e) => setTokenDescription(e.target.value)}
                      class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                      placeholder="What is this token used for?"
                    />
                  </div>
                </div>
              </Match>
            </Switch>
          </div>

          {/* Footer */}
          <Show when={step() === 'editor'}>
            <div class="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button
                class="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={resetAndClose}
              >
                Cancel
              </button>
              <button
                class="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                onClick={handleAdd}
              >
                Add Token
              </button>
            </div>
          </Show>
        </div>
      </div>
    </>
  )
}
