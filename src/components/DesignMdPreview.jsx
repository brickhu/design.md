import { createSignal, createMemo, Show } from 'solid-js'
import { getMeta, getTokens, getRules } from '../lib/store'
import { generateDesignMd } from '../lib/designmd-generator'

/**
 * DESIGN.md Preview — renders the generated DESIGN.md markdown
 * with copy and download buttons.
 */
export default function DesignMdPreview() {
  const [copied, setCopied] = createSignal(false)

  const designMdContent = createMemo(() => {
    return generateDesignMd({
      meta: getMeta(),
      tokens: getTokens(),
      rules: getRules(),
    })
  })

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(designMdContent())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = designMdContent()
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([designMdContent()], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'DESIGN.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Render the markdown as HTML (simple renderer)
  const renderedHtml = createMemo(() => {
    const md = designMdContent()
    return renderMarkdownToHtml(md)
  })

  return (
    <div class="mx-auto max-w-4xl space-y-4 p-6">
      {/* Header */}
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">DESIGN.md Preview</h2>
          <p class="text-sm text-gray-500">
            Preview of the generated DESIGN.md file following the Google Stitch format.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={handleDownload}
          >
            Download
          </button>
          <button
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            onClick={handleCopy}
          >
            {copied() ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Raw Markdown */}
      <div class="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div class="flex items-center justify-between border-b border-gray-100 px-4 py-2 bg-gray-50/50">
          <span class="text-xs font-medium text-gray-400">Raw Markdown</span>
        </div>
        <pre class="overflow-auto p-4 text-sm font-mono text-gray-700 leading-relaxed max-h-64">
          {designMdContent()}
        </pre>
      </div>

      {/* Rendered Preview */}
      <div class="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div class="flex items-center justify-between border-b border-gray-100 px-4 py-2 bg-gray-50/50">
          <span class="text-xs font-medium text-gray-400">Rendered Preview</span>
        </div>
        <div
          class="design-md-preview prose prose-sm max-w-none p-6"
          // eslint-disable-next-line solidjs/no-innerhtml
          innerHTML={renderedHtml()}
        />
      </div>
    </div>
  )
}

// ─── Simple Markdown → HTML Renderer ──────────────────────────────────

function renderMarkdownToHtml(md) {
  let html = md

  // Escape HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Front matter (highlighted)
  html = html.replace(
    /^---([\s\S]*?)---/,
    '<div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 font-mono text-xs text-gray-600 whitespace-pre overflow-auto">---$1---</div>'
  )

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-gray-800 mt-6 mb-2">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-gray-900 mt-8 mb-3 pb-1 border-b border-gray-200">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 rounded px-1 py-0.5 text-xs font-mono text-pink-600">$1</code>')

  // List items
  html = html.replace(/^- (.+)$/gm, '<li class="text-sm text-gray-700 ml-4 list-disc mb-1">$1</li>')

  // Paragraphs (double newlines → paragraph breaks)
  html = html.replace(/\n\n/g, '</p><p class="text-sm text-gray-700 mb-3">')
  html = '<p class="text-sm text-gray-700 mb-3">' + html + '</p>'

  // Clean up empty paragraphs
  html = html.replace(/<p class="[^"]*"><\/p>/g, '')

  // Group consecutive <li> into <ul>
  html = html.replace(/(<li class="[^"]*">.+?<\/li>)\n?(?!<li)/g, '<ul class="mb-3">$1</ul>')
  html = html.replace(/((?:<li class="[^"]*">.+?<\/li>\n?)+)/g, '<ul class="mb-3">$1</ul>')

  return html
}
