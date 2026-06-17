export default function Home() {
  return (
    <main class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="text-center">
        <h1 class="text-5xl font-bold tracking-tight text-gray-900">
          DESIGN<span class="text-blue-600">.</span>md
        </h1>
        <p class="mt-3 text-lg text-gray-500">
          Design Token Editor — W3C DTCG 2025.10
        </p>
        <p class="mt-1 text-sm text-gray-400">
          Visually edit design tokens and generate DESIGN.md files
        </p>

        <div class="mt-10 flex items-center justify-center gap-4">
          <a
            href="#/editor"
            class="rounded-xl bg-blue-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Open Editor →
          </a>
          <a
            href="https://www.designtokens.org/tr/2025.10/"
            target="_blank"
            rel="noopener"
            class="rounded-xl bg-white px-8 py-3 text-base font-medium text-gray-600 shadow-sm ring-1 ring-gray-200 hover:ring-gray-300 transition-all"
          >
            W3C DTCG Spec ↗
          </a>
        </div>

        <div class="mt-16 grid gap-6 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-6 text-left shadow-sm ring-1 ring-gray-100">
            <div class="text-2xl">🎨</div>
            <h3 class="mt-3 font-semibold text-gray-900">Visual Editor</h3>
            <p class="mt-1 text-sm text-gray-500">
              Edit colors, spacing, fonts, and more with type-specific inputs
            </p>
          </div>
          <div class="rounded-xl bg-white p-6 text-left shadow-sm ring-1 ring-gray-100">
            <div class="text-2xl">📋</div>
            <h3 class="mt-3 font-semibold text-gray-900">JSON Editor</h3>
            <p class="mt-1 text-sm text-gray-500">
              Edit raw W3C DTCG JSON with live sync to the visual editor
            </p>
          </div>
          <div class="rounded-xl bg-white p-6 text-left shadow-sm ring-1 ring-gray-100">
            <div class="text-2xl">📄</div>
            <h3 class="mt-3 font-semibold text-gray-900">DESIGN.md Export</h3>
            <p class="mt-1 text-sm text-gray-500">
              Generate and preview DESIGN.md following the Google Stitch format
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
