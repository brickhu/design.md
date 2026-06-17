import { createSignal, Switch, Match, For } from 'solid-js'
import TokenVisualEditor from '../components/TokenVisualEditor'
import JsonEditor from '../components/JsonEditor'
import MetaEditor from '../components/MetaEditor'
import RulesEditor from '../components/RulesEditor'
import DesignMdPreview from '../components/DesignMdPreview'

const TABS = [
  { key: 'visual', label: 'Visual' },
  { key: 'json', label: 'JSON' },
  { key: 'meta', label: 'Meta' },
  { key: 'rules', label: 'Rules' },
  { key: 'preview', label: 'Preview' },
]

export default function Editor() {
  const [activeTab, setActiveTab] = createSignal('visual')

  return (
    <div class="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div class="flex items-center gap-4">
          <a href="#/" class="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            DESIGN.md
          </a>
          <span class="text-sm text-gray-400">Theme Editor</span>
        </div>
        <div class="flex items-center gap-2">
          <a
            href="#/"
            class="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            ← Back
          </a>
        </div>
      </header>

      {/* Tab Bar */}
      <nav class="flex shrink-0 gap-1 border-b border-gray-200 bg-white px-6">
        <For each={TABS}>
          {(tab) => (
            <button
              class={`
                border-b-2 px-4 py-3 text-sm font-medium transition-colors
                ${activeTab() === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'}
              `}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          )}
        </For>
      </nav>

      {/* Tab Content */}
      <main class="flex-1 overflow-auto">
        <Switch>
          <Match when={activeTab() === 'visual'}>
            <TokenVisualEditor />
          </Match>
          <Match when={activeTab() === 'json'}>
            <JsonEditor />
          </Match>
          <Match when={activeTab() === 'meta'}>
            <MetaEditor />
          </Match>
          <Match when={activeTab() === 'rules'}>
            <RulesEditor />
          </Match>
          <Match when={activeTab() === 'preview'}>
            <DesignMdPreview />
          </Match>
        </Switch>
      </main>
    </div>
  )
}
