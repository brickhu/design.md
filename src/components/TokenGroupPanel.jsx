import { createSignal, For, Show } from 'solid-js'
import TokenItemEditor from './TokenItemEditor'
import { getTypeLabel, getGroupTokens } from '../lib/dtcg-spec'
import { addToken, removeToken, updateToken } from '../lib/store'

/**
 * Panel for one token group (colors, spacing, etc.).
 * Shows a collapsible list of tokens with add/remove functionality.
 */
export default function TokenGroupPanel(props) {
  const [collapsed, setCollapsed] = createSignal(false)
  const [newTokenName, setNewTokenName] = createSignal('')
  const [showAddForm, setShowAddForm] = createSignal(false)
  const [expandedDescriptions, setExpandedDescriptions] = createSignal({})

  const groupType = () => props.group.$type
  const groupLabel = () => props.label || getTypeLabel(groupType())

  const tokensList = () => {
    const tokenNames = getGroupTokens(props.group)
    return tokenNames.map(name => ({
      name,
      token: props.group[name],
    }))
  }

  const handleAdd = () => {
    const name = newTokenName().trim().toLowerCase().replace(/\s+/g, '-')
    if (!name) return
    const success = addToken(props.groupName, name, groupType())
    if (success) {
      setNewTokenName('')
      setShowAddForm(false)
    }
  }

  const handleAddKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') {
      setNewTokenName('')
      setShowAddForm(false)
    }
  }

  const handleUpdateToken = (tokenName, updates) => {
    updateToken(props.groupName, tokenName, updates)
  }

  const handleDeleteToken = (tokenName) => {
    removeToken(props.groupName, tokenName)
  }

  const toggleDescription = (tokenName) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [tokenName]: !prev[tokenName],
    }))
  }

  return (
    <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div
        class="flex cursor-pointer items-center justify-between px-4 py-3"
        onClick={() => setCollapsed(!collapsed())}
      >
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-400 transition-transform" classList={{ 'rotate-90': !collapsed() }}>
            ▶
          </span>
          <h3 class="font-semibold text-gray-800">{groupLabel()}</h3>
          <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
            {groupType()}
          </span>
          <span class="text-xs text-gray-400">
            {tokensList().length} tokens
          </span>
        </div>
        <button
          class="rounded-lg px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            if (props.onAddToken) {
              props.onAddToken(props.groupName)
            } else {
              setShowAddForm(true)
            }
          }}
        >
          + Add
        </button>
      </div>

      {/* Add Form */}
      <Show when={showAddForm()}>
        <div class="border-t border-gray-100 px-4 py-2 bg-gray-50/50">
          <div class="flex items-center gap-2">
            <input
              type="text"
              value={newTokenName()}
              onInput={(e) => setNewTokenName(e.target.value)}
              onKeyDown={handleAddKeyDown}
              class="flex-1 rounded border border-gray-300 px-2.5 py-1 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="token-name"
              // eslint-disable-next-line solidjs/jsx-no-undef
              ref={(el) => el?.focus()}
            />
            <button
              class="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
              onClick={handleAdd}
            >
              Add
            </button>
            <button
              class="rounded-lg px-2.5 py-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => { setNewTokenName(''); setShowAddForm(false) }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Show>

      {/* Token List */}
      <Show when={!collapsed()}>
        <div class="border-t border-gray-100 px-4 py-3 space-y-2">
          <Show
            when={tokensList().length > 0}
            fallback={
              <p class="text-sm text-gray-400 text-center py-4">
                No tokens yet. Click "+ Add" to create one.
              </p>
            }
          >
            <For each={tokensList()}>
              {(item) => (
                <TokenItemEditor
                  tokenName={item.name}
                  token={item.token}
                  groupType={groupType()}
                  onUpdate={handleUpdateToken}
                  onDelete={handleDeleteToken}
                  onToggleDescription={() => toggleDescription(item.name)}
                  expanded={expandedDescriptions()[item.name]}
                />
              )}
            </For>
          </Show>
        </div>
      </Show>
    </div>
  )
}
