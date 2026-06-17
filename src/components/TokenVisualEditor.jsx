import { For, Show, createSignal } from 'solid-js'
import TokenGroupPanel from './TokenGroupPanel'
import AddTokenModal from './AddTokenModal'
import { getTokens, getGroupNames, addTokenGroup } from '../lib/store'
import { EDITOR_GROUPS } from '../lib/dtcg-spec'

/**
 * Visual token editor: lists all token groups with add/remove ability.
 * Supports adding predefined groups or custom groups, and adding individual tokens
 * via a guided type-selection → visual-editor modal.
 */
export default function TokenVisualEditor() {
  const tokens = () => getTokens()
  const groupNames = () => getGroupNames()
  const [showAddTokenModal, setShowAddTokenModal] = createSignal(false)
  const [addTokenPreselectedGroup, setAddTokenPreselectedGroup] = createSignal(null)

  /** Groups not yet in the store that can be added. */
  const availableGroups = () => {
    const existing = new Set(groupNames())
    return EDITOR_GROUPS.filter(g => !existing.has(g.key))
  }

  const handleAddPresetGroup = (groupDef) => {
    addTokenGroup(groupDef.key, groupDef.type)
  }

  const handleOpenAddToken = (groupKey) => {
    setAddTokenPreselectedGroup(groupKey || null)
    setShowAddTokenModal(true)
  }

  const handleCloseAddToken = () => {
    setShowAddTokenModal(false)
    setAddTokenPreselectedGroup(null)
  }

  return (
    <div class="mx-auto max-w-3xl space-y-4 p-6">
      {/* Page Header */}
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Design Tokens</h2>
          <p class="text-sm text-gray-500">Edit your design tokens visually. Changes sync to the JSON editor.</p>
        </div>
        <button
          class="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          onClick={() => handleOpenAddToken(null)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Token
        </button>
      </div>

      {/* Add Token Modal (conditionally rendered for reactivity) */}
      <Show when={showAddTokenModal()}>
        <AddTokenModal
          preSelectedGroupKey={addTokenPreselectedGroup()}
          onClose={handleCloseAddToken}
        />
      </Show>

      {/* Token Groups */}
      <For each={groupNames()}>
        {(groupName) => {
          const group = tokens()[groupName]
          if (!group) return null
          const groupDef = EDITOR_GROUPS.find(g => g.key === groupName)
          return (
            <TokenGroupPanel
              groupName={groupName}
              group={group}
              label={groupDef?.label || groupName}
              icon={groupDef?.icon}
              onAddToken={handleOpenAddToken}
            />
          )
        }}
      </For>

      {/* Add Preset Groups */}
      <Show when={availableGroups().length > 0}>
        <div class="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-6">
          <h3 class="text-sm font-medium text-gray-600 mb-3">Add Token Group</h3>
          <div class="flex flex-wrap gap-2">
            <For each={availableGroups()}>
              {(groupDef) => (
                <button
                  class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all"
                  onClick={() => handleAddPresetGroup(groupDef)}
                >
                  <span>{groupDef.icon}</span>
                  <span>{groupDef.label}</span>
                  <span class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400">
                    {groupDef.type}
                  </span>
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Empty State */}
      <Show when={groupNames().length === 0}>
        <div class="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
          <p class="text-gray-400">No token groups yet. Add one from the options above.</p>
        </div>
      </Show>
    </div>
  )
}
