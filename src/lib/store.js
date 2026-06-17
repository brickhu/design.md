/**
 * Central Reactive Store
 *
 * Manages the design token data using SolidJS signals.
 * The store is the single source of truth — the visual editor,
 * JSON editor, and DESIGN.md export all read from it.
 */
import { createSignal, batch } from 'solid-js'
import { createDefaultValue, createToken, createTokenGroup, getGroupTokens } from './dtcg-spec'

// ─── Default State ─────────────────────────────────────────────────────

const DEFAULT_META = {
  name: '',
  author: '',
  overview: '',
}

const DEFAULT_TOKENS = {
  color: {
    $type: 'color',
    primary: { $value: '#3B82F6', $type: 'color', $description: 'Primary brand color' },
    secondary: { $value: '#6B7280', $type: 'color', $description: 'Secondary brand color' },
    background: { $value: '#FFFFFF', $type: 'color', $description: 'Page background' },
    surface: { $value: '#F9FAFB', $type: 'color', $description: 'Card and surface background' },
    text: { $value: '#111827', $type: 'color', $description: 'Primary text color' },
    'text-secondary': { $value: '#6B7280', $type: 'color', $description: 'Secondary text color' },
    border: { $value: '#E5E7EB', $type: 'color', $description: 'Border color' },
  },
  spacing: {
    $type: 'dimension',
    xs: { $value: { value: 4, unit: 'px' }, $type: 'dimension', $description: 'Extra small spacing' },
    sm: { $value: { value: 8, unit: 'px' }, $type: 'dimension', $description: 'Small spacing' },
    md: { $value: { value: 16, unit: 'px' }, $type: 'dimension', $description: 'Medium spacing' },
    lg: { $value: { value: 24, unit: 'px' }, $type: 'dimension', $description: 'Large spacing' },
    xl: { $value: { value: 32, unit: 'px' }, $type: 'dimension', $description: 'Extra large spacing' },
    '2xl': { $value: { value: 48, unit: 'px' }, $type: 'dimension', $description: '2x large spacing' },
  },
  borderRadius: {
    $type: 'dimension',
    none: { $value: { value: 0, unit: 'px' }, $type: 'dimension', $description: 'No border radius' },
    sm: { $value: { value: 4, unit: 'px' }, $type: 'dimension', $description: 'Small border radius' },
    md: { $value: { value: 8, unit: 'px' }, $type: 'dimension', $description: 'Medium border radius' },
    lg: { $value: { value: 12, unit: 'px' }, $type: 'dimension', $description: 'Large border radius' },
    full: { $value: { value: 9999, unit: 'px' }, $type: 'dimension', $description: 'Fully rounded' },
  },
  fontFamily: {
    $type: 'fontFamily',
    body: { $value: 'Inter', $type: 'fontFamily', $description: 'Primary body font' },
    heading: { $value: 'Inter', $type: 'fontFamily', $description: 'Heading font' },
    mono: { $value: 'JetBrains Mono', $type: 'fontFamily', $description: 'Monospace font for code' },
  },
  fontSize: {
    $type: 'fontSize',
    xs: { $value: { value: 12, unit: 'px' }, $type: 'fontSize', $description: 'Extra small text' },
    sm: { $value: { value: 14, unit: 'px' }, $type: 'fontSize', $description: 'Small text' },
    md: { $value: { value: 16, unit: 'px' }, $type: 'fontSize', $description: 'Body text' },
    lg: { $value: { value: 18, unit: 'px' }, $type: 'fontSize', $description: 'Large text' },
    xl: { $value: { value: 24, unit: 'px' }, $type: 'fontSize', $description: 'Heading 3' },
    '2xl': { $value: { value: 32, unit: 'px' }, $type: 'fontSize', $description: 'Heading 2' },
    '3xl': { $value: { value: 48, unit: 'px' }, $type: 'fontSize', $description: 'Heading 1' },
  },
  fontWeight: {
    $type: 'fontWeight',
    light: { $value: 300, $type: 'fontWeight' },
    normal: { $value: 400, $type: 'fontWeight' },
    medium: { $value: 500, $type: 'fontWeight' },
    semibold: { $value: 600, $type: 'fontWeight' },
    bold: { $value: 700, $type: 'fontWeight' },
  },
  typography: {
    $type: 'typography',
    'heading-1': {
      $value: { fontFamily: 'Inter', fontSize: { value: 48, unit: 'px' }, fontWeight: 700, lineHeight: 1.1, letterSpacing: -0.02 },
      $type: 'typography',
      $description: 'Main page heading',
    },
    'heading-2': {
      $value: { fontFamily: 'Inter', fontSize: { value: 32, unit: 'px' }, fontWeight: 600, lineHeight: 1.2 },
      $type: 'typography',
      $description: 'Section heading',
    },
    body: {
      $value: { fontFamily: 'Inter', fontSize: { value: 16, unit: 'px' }, fontWeight: 400, lineHeight: 1.6 },
      $type: 'typography',
      $description: 'Body text',
    },
    caption: {
      $value: { fontFamily: 'Inter', fontSize: { value: 12, unit: 'px' }, fontWeight: 400, lineHeight: 1.4 },
      $type: 'typography',
      $description: 'Caption and label text',
    },
  },
}

const DEFAULT_RULES = [
  { type: 'do', description: 'Use the primary color for the single most important action per screen' },
  { type: 'do', description: 'Maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)' },
  { type: 'dont', description: "Don't use pure black (#000000) — use the text color token instead" },
  { type: 'dont', description: "Don't mix rounded and sharp corners in the same view" },
]

// ─── Signals ───────────────────────────────────────────────────────────

const [meta, setMeta] = createSignal(structuredClone(DEFAULT_META))
const [tokens, setTokens] = createSignal(structuredClone(DEFAULT_TOKENS))
const [rules, setRules] = createSignal(structuredClone(DEFAULT_RULES))

// ─── Meta Actions ──────────────────────────────────────────────────────

export function updateMeta(field, value) {
  setMeta(prev => ({ ...prev, [field]: value }))
}

export function getMeta() {
  return meta
}

// ─── Token Actions ─────────────────────────────────────────────────────

export function getTokens() {
  return tokens
}

export function getGroupNames() {
  return Object.keys(tokens())
}

export function getGroup(groupName) {
  return tokens()[groupName]
}

export function getGroupType(groupName) {
  return tokens()[groupName]?.$type
}

/**
 * Add a new token group.
 */
export function addTokenGroup(groupName, type) {
  if (tokens()[groupName]) return false
  setTokens(prev => ({
    ...prev,
    [groupName]: createTokenGroup(type),
  }))
  return true
}

/**
 * Remove a token group.
 */
export function removeTokenGroup(groupName) {
  setTokens(prev => {
    const next = { ...prev }
    delete next[groupName]
    return next
  })
}

/**
 * Add a token to an existing group.
 */
export function addToken(groupName, tokenName, type, value, description) {
  const group = tokens()[groupName]
  if (!group) return false
  if (tokenName in group) return false // token already exists

  const newToken = createToken(type || group.$type, value, description)

  setTokens(prev => ({
    ...prev,
    [groupName]: {
      ...prev[groupName],
      [tokenName]: newToken,
    },
  }))
  return true
}

/**
 * Remove a token from a group.
 */
export function removeToken(groupName, tokenName) {
  const group = tokens()[groupName]
  if (!group || !(tokenName in group)) return false

  setTokens(prev => {
    const updated = { ...prev[groupName] }
    delete updated[tokenName]
    return { ...prev, [groupName]: updated }
  })
  return true
}

/**
 * Update a token's value, description, or name.
 */
export function updateToken(groupName, tokenName, updates) {
  const group = tokens()[groupName]
  if (!group || !(tokenName in group)) return false

  setTokens(prev => {
    const existing = prev[groupName][tokenName]
    const updated = { ...existing }

    if ('$value' in updates) updated.$value = updates.$value
    if ('$description' in updates) updated.$description = updates.$description
    if ('$type' in updates) updated.$type = updates.$type

    // Handle renaming
    if (updates.newName && updates.newName !== tokenName) {
      const groupCopy = { ...prev[groupName] }
      delete groupCopy[tokenName]
      groupCopy[updates.newName] = updated
      return { ...prev, [groupName]: groupCopy }
    }

    return {
      ...prev,
      [groupName]: {
        ...prev[groupName],
        [tokenName]: updated,
      },
    }
  })
  return true
}

/**
 * Update a group's $type.
 */
export function updateGroupType(groupName, type) {
  const group = tokens()[groupName]
  if (!group) return false

  setTokens(prev => ({
    ...prev,
    [groupName]: {
      ...prev[groupName],
      $type: type,
    },
  }))
  return true
}

// ─── Rule Actions ──────────────────────────────────────────────────────

export function getRules() {
  return rules
}

export function addRule(type, description) {
  setRules(prev => [...prev, { type, description }])
}

export function removeRule(index) {
  setRules(prev => prev.filter((_, i) => i !== index))
}

export function updateRule(index, updates) {
  setRules(prev => prev.map((rule, i) => (i === index ? { ...rule, ...updates } : rule)))
}

export function moveRule(fromIndex, toIndex) {
  setRules(prev => {
    const next = [...prev]
    const [removed] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, removed)
    return next
  })
}

// ─── Import / Export ───────────────────────────────────────────────────

/**
 * Export the entire state as a W3C DTCG-compatible JSON object.
 */
export function exportToJSON() {
  return {
    meta: meta(),
    tokens: tokens(),
    rules: rules(),
  }
}

/**
 * Import state from a JSON object.
 * Returns true on success, false on parse error.
 */
export function importFromJSON(json) {
  try {
    const data = typeof json === 'string' ? JSON.parse(json) : json

    batch(() => {
      if (data.meta) {
        setMeta({
          name: data.meta.name || '',
          author: data.meta.author || '',
          overview: data.meta.overview || '',
        })
      }

      if (data.tokens && typeof data.tokens === 'object') {
        setTokens(structuredClone(data.tokens))
      }

      if (data.rules && Array.isArray(data.rules)) {
        setRules(structuredClone(data.rules))
      }
    })

    return true
  } catch (e) {
    console.error('Failed to import JSON:', e)
    return false
  }
}

/**
 * Reset the store to default values.
 */
export function resetStore() {
  batch(() => {
    setMeta(structuredClone(DEFAULT_META))
    setTokens(structuredClone(DEFAULT_TOKENS))
    setRules(structuredClone(DEFAULT_RULES))
  })
}
