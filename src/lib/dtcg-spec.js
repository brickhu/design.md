/**
 * W3C Design Tokens Format Module 2025.10 — Type Definitions & Helpers
 *
 * Reference: https://www.designtokens.org/tr/2025.10/
 *
 * Defines valid token types, their value shapes, default values,
 * and helper functions for creating and validating design tokens.
 */

// ─── Token Type Definitions ───────────────────────────────────────────

export const TOKEN_TYPES = {
  color: {
    label: 'Color',
    icon: '🎨',
    description: 'A color value in any CSS-compatible format or structured object',
    valueShape: 'string-or-object',
    // Structured: { colorSpace, components, alpha, hex }
    // Simple: "#hex", "rgb()", "oklch()", etc.
    defaultSimpleValue: '#3B82F6',
    defaultStructuredValue: {
      colorSpace: 'srgb',
      components: [0.23, 0.51, 0.96],
      alpha: 1.0,
      hex: '#3B82F6',
    },
  },
  dimension: {
    label: 'Dimension',
    icon: '📏',
    description: 'A size with a numeric value and unit',
    valueShape: 'object',
    defaultValue: { value: 16, unit: 'px' },
    validUnits: ['px', 'rem', 'em', '%', 'vw', 'vh', 'vmin', 'vmax', 'pt', 'ch', 'ex'],
  },
  number: {
    label: 'Number',
    icon: '🔢',
    description: 'A plain numeric value',
    valueShape: 'number',
    defaultValue: 0,
  },
  fontFamily: {
    label: 'Font Family',
    icon: '🔤',
    description: 'A font family name or array of font family names',
    valueShape: 'string-or-array',
    defaultValue: 'Inter',
    suggestions: [
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'Noto Sans',
      'Public Sans',
      'Space Grotesk',
      'Mona Sans',
      'Geist',
      'JetBrains Mono',
      'Fira Code',
      'Source Code Pro',
    ],
  },
  fontWeight: {
    label: 'Font Weight',
    icon: '💪',
    description: 'Font weight as a number (1-1000) or keyword',
    valueShape: 'number-or-string',
    defaultValue: 400,
    keywords: {
      thin: 100,
      'extra-light': 200,
      light: 300,
      normal: 400,
      regular: 400,
      medium: 500,
      'semi-bold': 600,
      bold: 700,
      'extra-bold': 800,
      black: 900,
    },
  },
  fontSize: {
    label: 'Font Size',
    icon: '📐',
    description: 'Font size as a dimension (value + unit)',
    valueShape: 'object',
    defaultValue: { value: 16, unit: 'px' },
    validUnits: ['px', 'rem', 'em', 'pt', '%'],
  },
  typography: {
    label: 'Typography',
    icon: '📝',
    description: 'Composite typography style',
    valueShape: 'object',
    defaultValue: {
      fontFamily: 'Inter',
      fontSize: { value: 16, unit: 'px' },
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
  },
  duration: {
    label: 'Duration',
    icon: '⏱️',
    description: 'A time duration for animations/transitions',
    valueShape: 'object',
    defaultValue: { value: 300, unit: 'ms' },
    validUnits: ['ms', 's'],
  },
  cubicBezier: {
    label: 'Cubic Bezier',
    icon: '📈',
    description: 'A cubic bezier easing curve [P1x, P1y, P2x, P2y]',
    valueShape: 'array',
    defaultValue: [0.4, 0, 0.2, 1],
  },
  shadow: {
    label: 'Shadow',
    icon: '🕶️',
    description: 'Box shadow definition',
    valueShape: 'object-or-array',
    defaultValue: {
      color: { colorSpace: 'srgb', components: [0, 0, 0], alpha: 0.1, hex: '#0000001a' },
      offsetX: { value: 0, unit: 'px' },
      offsetY: { value: 4, unit: 'px' },
      blur: { value: 8, unit: 'px' },
      spread: { value: 0, unit: 'px' },
    },
  },
  border: {
    label: 'Border',
    icon: '⬜',
    description: 'Border style definition',
    valueShape: 'object',
    defaultValue: {
      color: { colorSpace: 'srgb', components: [0.8, 0.8, 0.8], alpha: 1, hex: '#cccccc' },
      width: { value: 1, unit: 'px' },
      style: 'solid',
    },
  },
  gradient: {
    label: 'Gradient',
    icon: '🌈',
    description: 'A gradient definition (array of stops)',
    valueShape: 'array',
    defaultValue: [
      { color: { colorSpace: 'srgb', components: [0.23, 0.51, 0.96], alpha: 1, hex: '#3B82F6' }, position: 0 },
      { color: { colorSpace: 'srgb', components: [0.58, 0.23, 0.96], alpha: 1, hex: '#9333EA' }, position: 1 },
    ],
  },
  strokeStyle: {
    label: 'Stroke Style',
    icon: '✏️',
    description: 'Stroke style for borders/lines',
    valueShape: 'string-or-object',
    defaultValue: 'solid',
    keywords: ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'none'],
  },
  transition: {
    label: 'Transition',
    icon: '🔄',
    description: 'A transition definition',
    valueShape: 'object',
    defaultValue: {
      duration: { value: 300, unit: 'ms' },
      delay: { value: 0, unit: 'ms' },
      timingFunction: [0.4, 0, 0.2, 1],
    },
  },
}

// ─── UI Group Definitions ────────────────────────────────────────────
// These map user-facing editor groups to DTCG types

export const EDITOR_GROUPS = [
  {
    key: 'color',
    label: 'Colors',
    icon: '🎨',
    type: 'color',
    description: 'Color palette tokens (primary, secondary, background, etc.)',
  },
  {
    key: 'spacing',
    label: 'Spacing',
    icon: '📏',
    type: 'dimension',
    description: 'Spacing scale tokens (xs, sm, md, lg, xl, etc.)',
  },
  {
    key: 'borderRadius',
    label: 'Border Radius',
    icon: '⭕',
    type: 'dimension',
    description: 'Border radius / corner rounding tokens',
  },
  {
    key: 'fontFamily',
    label: 'Font Families',
    icon: '🔤',
    type: 'fontFamily',
    description: 'Font family tokens (body, heading, mono, etc.)',
  },
  {
    key: 'fontSize',
    label: 'Font Sizes',
    icon: '📐',
    type: 'fontSize',
    description: 'Font size scale tokens (xs, sm, md, lg, xl, etc.)',
  },
  {
    key: 'fontWeight',
    label: 'Font Weights',
    icon: '💪',
    type: 'fontWeight',
    description: 'Font weight tokens (light, regular, medium, bold, etc.)',
  },
  {
    key: 'typography',
    label: 'Typography Styles',
    icon: '📝',
    type: 'typography',
    description: 'Composite typography styles (heading-1, body, caption, etc.)',
  },
  {
    key: 'shadow',
    label: 'Shadows',
    icon: '🕶️',
    type: 'shadow',
    description: 'Box shadow tokens (sm, md, lg, etc.)',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────

/**
 * Create a default token value for a given DTCG type.
 */
export function createDefaultValue(type) {
  const spec = TOKEN_TYPES[type]
  if (!spec) return ''
  return structuredClone(spec.defaultValue || spec.defaultSimpleValue || spec.defaultStructuredValue || '')
}

/**
 * Get a human-readable label for a token type.
 */
export function getTypeLabel(type) {
  return TOKEN_TYPES[type]?.label || type
}

/**
 * Get a human-readable display string for a token value.
 */
export function formatTokenValue(type, value) {
  if (value == null) return '—'

  switch (type) {
    case 'color':
      if (typeof value === 'string') return value
      if (value?.hex) return value.hex
      if (value?.components && value?.colorSpace === 'srgb') {
        const [r, g, b] = value.components.map(c => Math.round(c * 255))
        const a = value.alpha ?? 1
        if (a === 1) return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
        return `rgba(${r}, ${g}, ${b}, ${a})`
      }
      return JSON.stringify(value)

    case 'dimension':
    case 'fontSize':
      if (typeof value === 'object' && value.value !== undefined) {
        return `${value.value}${value.unit || 'px'}`
      }
      return String(value)

    case 'number':
      return String(value)

    case 'fontFamily':
      if (Array.isArray(value)) return value.join(', ')
      return String(value)

    case 'fontWeight':
      return String(value)

    case 'typography':
      if (typeof value === 'object') {
        const parts = []
        if (value.fontFamily) parts.push(Array.isArray(value.fontFamily) ? value.fontFamily[0] : value.fontFamily)
        if (value.fontSize) parts.push(formatTokenValue('fontSize', value.fontSize))
        if (value.fontWeight) parts.push(String(value.fontWeight))
        return parts.join(' / ') || '—'
      }
      return String(value)

    case 'duration':
      if (typeof value === 'object' && value.value !== undefined) {
        return `${value.value}${value.unit || 'ms'}`
      }
      return String(value)

    case 'cubicBezier':
      if (Array.isArray(value)) return `cubic-bezier(${value.join(', ')})`
      return String(value)

    default:
      if (typeof value === 'object') return JSON.stringify(value)
      return String(value)
  }
}

/**
 * Parse a flat value into structured format if needed for a given type.
 */
export function parseTokenValue(type, input) {
  switch (type) {
    case 'color':
      // Keep as-is; both string and structured forms are valid
      return input

    case 'dimension':
    case 'fontSize':
      if (typeof input === 'string') {
        const match = input.match(/^(-?[\d.]+)\s*(px|rem|em|%|vw|vh|pt|ch|ex)?$/)
        if (match) {
          return { value: parseFloat(match[1]), unit: match[2] || 'px' }
        }
        return { value: parseFloat(input) || 0, unit: 'px' }
      }
      if (typeof input === 'number') return { value: input, unit: 'px' }
      return input

    case 'duration':
      if (typeof input === 'string') {
        const match = input.match(/^(-?[\d.]+)\s*(ms|s)?$/)
        if (match) {
          return { value: parseFloat(match[1]), unit: match[2] || 'ms' }
        }
        return { value: parseFloat(input) || 0, unit: 'ms' }
      }
      if (typeof input === 'number') return { value: input, unit: 'ms' }
      return input

    case 'fontWeight':
      if (typeof input === 'string' && isNaN(input)) {
        // Try to resolve keyword
        const kw = input.toLowerCase()
        if (TOKEN_TYPES.fontWeight.keywords[kw]) {
          return TOKEN_TYPES.fontWeight.keywords[kw]
        }
      }
      const num = parseInt(input)
      return isNaN(num) ? 400 : Math.max(1, Math.min(1000, num))

    default:
      return input
  }
}

/**
 * Validate a token value against its type specification.
 * Returns { valid: boolean, errors: string[] }.
 */
export function validateTokenValue(type, value) {
  const errors = []
  const spec = TOKEN_TYPES[type]
  if (!spec) return { valid: true, errors: [] }

  if (value === undefined || value === null || value === '') {
    errors.push('Value is required')
    return { valid: false, errors }
  }

  switch (type) {
    case 'dimension':
    case 'fontSize':
      if (typeof value === 'object') {
        if (typeof value.value !== 'number' || isNaN(value.value)) {
          errors.push('Dimension value must be a number')
        }
        if (value.unit && !(spec.validUnits || []).includes(value.unit)) {
          errors.push(`Invalid unit "${value.unit}". Valid: ${(spec.validUnits || []).join(', ')}`)
        }
      }
      break

    case 'duration':
      if (typeof value === 'object') {
        if (typeof value.value !== 'number' || isNaN(value.value)) {
          errors.push('Duration value must be a number')
        }
        if (value.unit && !['ms', 's'].includes(value.unit)) {
          errors.push('Duration unit must be "ms" or "s"')
        }
      }
      break

    case 'fontWeight':
      if (typeof value === 'number') {
        if (value < 1 || value > 1000) {
          errors.push('Font weight must be between 1 and 1000')
        }
      }
      break
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Create a new token object with DTCG $ properties.
 */
export function createToken(type, value, description) {
  const parsedValue = value !== undefined ? parseTokenValue(type, value) : createDefaultValue(type)
  const token = {
    $value: parsedValue,
    $type: type,
  }
  if (description) token.$description = description
  return token
}

/**
 * Create a new empty token group object.
 */
export function createTokenGroup(type) {
  return {
    $type: type,
  }
}

/**
 * Get all tokens from a group (keys that don't start with $).
 */
export function getGroupTokens(group) {
  return Object.keys(group).filter(k => !k.startsWith('$'))
}

/**
 * Check if an object is a token (has $value) or a group (no $value, has $type).
 */
export function isToken(obj) {
  return obj && typeof obj === 'object' && '$value' in obj
}

export function isGroup(obj) {
  return obj && typeof obj === 'object' && !('$value' in obj) && '$type' in obj
}
