import { getMeta, updateMeta } from '../lib/store'

/**
 * Theme metadata editor — Name, Author, Overview.
 */
export default function MetaEditor() {
  const meta = () => getMeta()

  return (
    <div class="mx-auto max-w-2xl space-y-4 p-6">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Theme Metadata</h2>
        <p class="text-sm text-gray-500">
          Define the name, author, and description for your design theme.
        </p>
      </div>

      <div class="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Name */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Name
            <span class="ml-1 text-red-400">*</span>
          </label>
          <input
            type="text"
            value={meta().name || ''}
            onInput={(e) => updateMeta('name', e.target.value)}
            class="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="My Design Theme"
          />
          <p class="mt-1 text-xs text-gray-400">The name of your theme, e.g., "Acme Design System".</p>
        </div>

        {/* Author */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Author</label>
          <input
            type="text"
            value={meta().author || ''}
            onInput={(e) => updateMeta('author', e.target.value)}
            class="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Your Name or Team"
          />
          <p class="mt-1 text-xs text-gray-400">The author or team responsible for this theme.</p>
        </div>

        {/* Overview */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Overview / Description</label>
          <textarea
            value={meta().overview || ''}
            onInput={(e) => updateMeta('overview', e.target.value)}
            class="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-y"
            rows={4}
            placeholder="Describe your design theme's philosophy, target audience, and visual direction..."
          />
          <p class="mt-1 text-xs text-gray-400">
            A brief overview of your design system's philosophy and goals. This becomes the Overview section in the generated DESIGN.md.
          </p>
        </div>
      </div>
    </div>
  )
}
