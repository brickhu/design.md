/**
 * DESIGN.md Generator
 *
 * Converts the W3C DTCG token store into a DESIGN.md file
 * following the Google Stitch format specification.
 *
 * Reference: https://github.com/google-labs-code/design.md
 */

import { formatTokenValue } from './dtcg-spec'

/**
 * Generate a complete DESIGN.md string from token data.
 * @param {object} data - { meta, tokens, rules }
 * @returns {string} The DESIGN.md markdown content
 */
export function generateDesignMd(data) {
  const { meta, tokens, rules } = data
  const sections = []

  // ─── YAML Front Matter ─────────────────────────────────────────────
  sections.push(buildFrontMatter(meta, tokens))

  // ─── Markdown Body ─────────────────────────────────────────────────
  sections.push(buildOverview(meta))
  sections.push(buildColors(tokens))
  sections.push(buildTypography(tokens))
  sections.push(buildLayout(tokens))
  sections.push(buildElevation(tokens))
  sections.push(buildShapes(tokens))
  sections.push(buildComponents(tokens))
  sections.push(buildDosAndDonts(rules))

  return sections.filter(Boolean).join('\n')
}

// ─── YAML Front Matter ───────────────────────────────────────────────

function buildFrontMatter(meta, tokens) {
  const lines = ['---']

  if (meta.name) lines.push(`name: ${escapeYaml(meta.name)}`)
  if (meta.overview) lines.push(`description: ${escapeYaml(meta.overview)}`)

  // Colors
  const colorGroup = tokens.color
  if (colorGroup) {
    lines.push('colors:')
    for (const [name, token] of getTokens(colorGroup)) {
      const val = getColorDisplayValue(token.$value)
      lines.push(`  ${name}: "${val}"`)
    }
  }

  // Typography
  const typoGroup = tokens.typography
  if (typoGroup) {
    lines.push('typography:')
    for (const [name, token] of getTokens(typoGroup)) {
      const val = token.$value
      if (typeof val === 'object' && val !== null) {
        lines.push(`  ${name}:`)
        if (val.fontFamily) {
          const ff = Array.isArray(val.fontFamily) ? val.fontFamily.join(', ') : val.fontFamily
          lines.push(`    fontFamily: ${ff}`)
        }
        if (val.fontSize) lines.push(`    fontSize: ${formatTokenValue('fontSize', val.fontSize)}`)
        if (val.fontWeight) lines.push(`    fontWeight: ${val.fontWeight}`)
        if (val.lineHeight) lines.push(`    lineHeight: ${val.lineHeight}`)
        if (val.letterSpacing) lines.push(`    letterSpacing: ${val.letterSpacing}`)
      }
    }
  }

  // Rounded
  const radiusGroup = tokens.borderRadius
  if (radiusGroup) {
    lines.push('rounded:')
    for (const [name, token] of getTokens(radiusGroup)) {
      lines.push(`  ${name}: ${formatTokenValue('dimension', token.$value)}`)
    }
  }

  // Spacing
  const spacingGroup = tokens.spacing
  if (spacingGroup) {
    lines.push('spacing:')
    for (const [name, token] of getTokens(spacingGroup)) {
      lines.push(`  ${name}: ${formatTokenValue('dimension', token.$value)}`)
    }
  }

  // Font families
  const ffGroup = tokens.fontFamily
  if (ffGroup) {
    lines.push('fontFamilies:')
    for (const [name, token] of getTokens(ffGroup)) {
      const val = Array.isArray(token.$value) ? token.$value.join(', ') : token.$value
      lines.push(`  ${name}: "${val}"`)
    }
  }

  lines.push('---')
  lines.push('')
  return lines.join('\n')
}

// ─── Overview ─────────────────────────────────────────────────────────

function buildOverview(meta) {
  if (!meta.overview) return null

  return [
    '## Overview',
    '',
    meta.overview,
    '',
  ].join('\n')
}

// ─── Colors ───────────────────────────────────────────────────────────

function buildColors(tokens) {
  const group = tokens.color
  if (!group) return null

  const lines = ['## Colors', '']
  const items = getTokens(group)

  if (items.length === 0) {
    lines.push('_No color tokens defined._')
    lines.push('')
    return lines.join('\n')
  }

  for (const [name, token] of items) {
    const val = getColorDisplayValue(token.$value)
    const desc = token.$description ? ` — ${token.$description}` : ''
    lines.push(`- **${capitalize(name)} (${val}):** Used for ${name.replace(/-/g, ' ')}.${desc}`)
  }

  lines.push('')
  return lines.join('\n')
}

// ─── Typography ───────────────────────────────────────────────────────

function buildTypography(tokens) {
  const typoGroup = tokens.typography
  const ffGroup = tokens.fontFamily
  const fsGroup = tokens.fontSize
  const fwGroup = tokens.fontWeight

  if (!typoGroup && !ffGroup && !fsGroup && !fwGroup) return null

  const lines = ['## Typography', '']

  // Font families
  if (ffGroup) {
    const items = getTokens(ffGroup)
    for (const [name, token] of items) {
      const val = Array.isArray(token.$value) ? token.$value.join(', ') : token.$value
      const desc = token.$description ? ` — ${token.$description}` : ''
      lines.push(`- **${capitalize(name)}:** \`${val}\`${desc}`)
    }
    if (items.length > 0) lines.push('')
  }

  // Font sizes
  if (fsGroup) {
    const items = getTokens(fsGroup)
    if (items.length > 0) {
      lines.push('**Font Size Scale:**')
      for (const [name, token] of items) {
        lines.push(`- \`${name}\` — ${formatTokenValue('fontSize', token.$value)}`)
      }
      lines.push('')
    }
  }

  // Font weights
  if (fwGroup) {
    const items = getTokens(fwGroup)
    if (items.length > 0) {
      lines.push('**Font Weights:**')
      for (const [name, token] of items) {
        lines.push(`- \`${name}\` — ${token.$value}`)
      }
      lines.push('')
    }
  }

  // Typography styles
  if (typoGroup) {
    const items = getTokens(typoGroup)
    for (const [name, token] of items) {
      const val = token.$value
      if (typeof val === 'object' && val !== null) {
        const parts = []
        if (val.fontFamily) parts.push(Array.isArray(val.fontFamily) ? val.fontFamily[0] : val.fontFamily)
        if (val.fontSize) parts.push(formatTokenValue('fontSize', val.fontSize))
        if (val.fontWeight) parts.push(`weight ${val.fontWeight}`)
        if (val.lineHeight) parts.push(`line-height ${val.lineHeight}`)
        const desc = token.$description ? `. ${token.$description}` : ''
        lines.push(`- **${capitalize(name)}:** ${parts.join(', ')}${desc}`)
      }
    }
    lines.push('')
  }

  return lines.join('\n')
}

// ─── Layout ───────────────────────────────────────────────────────────

function buildLayout(tokens) {
  const spacing = tokens.spacing
  if (!spacing) return null

  const items = getTokens(spacing)
  if (items.length === 0) return null

  const lines = ['## Layout', '']
  lines.push('The layout follows a spacing scale with these values:')
  lines.push('')

  for (const [name, token] of items) {
    lines.push(`- **${name}:** ${formatTokenValue('dimension', token.$value)}`)
  }

  lines.push('')
  return lines.join('\n')
}

// ─── Elevation & Depth ────────────────────────────────────────────────

function buildElevation(tokens) {
  const shadows = tokens.shadow
  if (!shadows) return null

  const items = getTokens(shadows)
  if (items.length === 0) return null

  const lines = ['## Elevation & Depth', '']
  lines.push('Depth is conveyed through shadow levels:')
  lines.push('')

  for (const [name, token] of items) {
    const desc = token.$description ? ` — ${token.$description}` : ''
    lines.push(`- **${capitalize(name)}:** Shadow level for ${name.replace(/-/g, ' ')}${desc}`)
  }

  lines.push('')
  return lines.join('\n')
}

// ─── Shapes ───────────────────────────────────────────────────────────

function buildShapes(tokens) {
  const radius = tokens.borderRadius
  if (!radius) return null

  const items = getTokens(radius)
  if (items.length === 0) return null

  const lines = ['## Shapes', '']
  lines.push('Border radius values define the shape language:')
  lines.push('')

  for (const [name, token] of items) {
    lines.push(`- **${name}:** ${formatTokenValue('dimension', token.$value)}`)
  }

  lines.push('')
  return lines.join('\n')
}

// ─── Components ───────────────────────────────────────────────────────

function buildComponents(tokens) {
  const comps = tokens.components
  if (!comps) return null

  const items = getTokens(comps)
  if (items.length === 0) return null

  const lines = ['## Components', '']

  for (const [name, token] of items) {
    const val = token.$value
    const desc = token.$description ? ` — ${token.$description}` : ''
    lines.push(`- **${capitalize(name)}:** ${typeof val === 'object' ? JSON.stringify(val) : val}${desc}`)
  }

  lines.push('')
  return lines.join('\n')
}

// ─── Do's and Don'ts ──────────────────────────────────────────────────

function buildDosAndDonts(rules) {
  if (!rules || rules.length === 0) return null

  const lines = ['## Do\'s and Don\'ts', '']

  for (const rule of rules) {
    const prefix = rule.type === 'do' ? '✅ Do' : '🚫 Don\'t'
    lines.push(`- ${prefix}: ${rule.description}`)
  }

  lines.push('')
  return lines.join('\n')
}

// ─── Helpers ──────────────────────────────────────────────────────────

function getTokens(group) {
  if (!group || typeof group !== 'object') return []
  return Object.keys(group)
    .filter(k => !k.startsWith('$'))
    .map(k => [k, group[k]])
}

function getColorDisplayValue(value) {
  if (typeof value === 'string') return value
  if (value?.hex) return value.hex
  if (value?.colorSpace === 'srgb' && value?.components) {
    const [r, g, b] = value.components.map(c => Math.round(c * 255))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }
  return String(value)
}

function capitalize(str) {
  return str
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function escapeYaml(str) {
  // Simple YAML escaping
  if (typeof str !== 'string') return str
  if (str.includes(':') || str.includes('#') || str.includes('"') || str.includes("'")) {
    return `"${str.replace(/"/g, '\\"')}"`
  }
  return str
}
