export const STYLE_PRESETS = [
  {
    name: 'vega',
    title: 'Vega',
    description: 'The classic shadcn/ui look.',
    aliases: [],
  },
  {
    name: 'nova',
    title: 'Nova',
    description: 'Reduced padding and margins for compact layouts.',
    aliases: [],
  },
  {
    name: 'mala',
    title: 'Mala',
    description: 'Soft and rounded, with generous spacing.',
    aliases: ['maia'],
  },
  {
    name: 'lyra',
    title: 'Lyra',
    description: 'Boxy and sharp. Pairs well with mono fonts.',
    aliases: [],
  },
  {
    name: 'mira',
    title: 'Mira',
    description: 'Compact and made for dense interfaces.',
    aliases: [],
  },
] as const

export type StylePreset = (typeof STYLE_PRESETS)[number]

export function getStylePreset(name: string) {
  const normalizedName = name.toLowerCase()

  return (
    STYLE_PRESETS.find(
      style => style.name === normalizedName || style.aliases.includes(normalizedName),
    ) ?? STYLE_PRESETS[0]
  )
}

function scopedSelector(scope: string | undefined, selector: string) {
  if (!scope) {
    return selector
  }

  if (selector === ':root') {
    return scope
  }

  return `${scope} ${selector}`
}

export function generateStyleCss(name: string, options?: { scope?: string }) {
  const style = getStylePreset(name)
  const scope = options?.scope
  const select = (selector: string) => scopedSelector(scope, selector)

  switch (style.name) {
    case 'nova':
      return `
${select(':root')} {
  --radius-component: max(calc(var(--radius) - 0.2rem), 0.25rem);
}

${select('[data-slot="button"]')} {
  height: 2rem;
  padding-inline: 0.75rem;
  font-size: 0.8125rem;
}

${select('[data-slot="card"]')} {
  gap: 1rem;
  padding-block: 1rem;
}

${select('[data-slot="card-header"]')},
${select('[data-slot="card-content"]')},
${select('[data-slot="card-footer"]')} {
  padding-inline: 1rem;
}

${select('[data-slot="card-header"]')} {
  gap: 0.25rem;
}

${select('[data-slot="tabs-list"]')} {
  height: 2rem;
}

${select('[data-slot="tabs-trigger"]')} {
  padding-inline: 0.625rem;
  font-size: 0.8125rem;
}

${select('[data-slot="radio-group"]')} {
  gap: 0.625rem;
}
`
    case 'mala':
      return `
${select(':root')} {
  --radius-component: calc(var(--radius) + 0.375rem);
}

${select('[data-slot="button"]')} {
  height: 2.5rem;
  padding-inline: 1rem;
}

${select('[data-slot="card"]')} {
  gap: 1.5rem;
  padding-block: 1.5rem;
}

${select('[data-slot="card-header"]')},
${select('[data-slot="card-content"]')},
${select('[data-slot="card-footer"]')} {
  padding-inline: 1.5rem;
}

${select('[data-slot="tabs"]')} {
  gap: 0.875rem;
}

${select('[data-slot="tabs-list"]')} {
  height: 2.5rem;
  padding: 0.25rem;
}

${select('[data-slot="tabs-trigger"]')} {
  padding-inline: 0.875rem;
}

${select('[data-slot="checkbox-control"]')},
${select('[data-slot="radio-group-item-control"]')} {
  width: 1.125rem;
  height: 1.125rem;
}

${select('[data-slot="switch-control"]')} {
  width: 2.5rem;
  height: 1.5rem;
}

${select('[data-slot="switch-thumb"]')} {
  width: 1.125rem;
  height: 1.125rem;
}
`
    case 'lyra':
      return `
${select(':root')} {
  --radius-component: 0px;
  --font-sans:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
    monospace;
}

${select('[data-slot="button"]')} {
  box-shadow: none;
}

${select('[data-slot="card"]')} {
  gap: 1rem;
  padding-block: 1rem;
  box-shadow: none;
}

${select('[data-slot="card-header"]')},
${select('[data-slot="card-content"]')},
${select('[data-slot="card-footer"]')} {
  padding-inline: 1rem;
}

${select('[data-slot="tabs-list"]')} {
  height: 2.25rem;
  box-shadow: none;
}

${select('[data-slot="tabs-indicator"]')} {
  box-shadow: none;
}
`
    case 'mira':
      return `
${select(':root')} {
  --radius-component: max(calc(var(--radius) - 0.3rem), 0.2rem);
}

${select('[data-slot="button"]')} {
  height: 1.875rem;
  gap: 0.375rem;
  padding-inline: 0.625rem;
  font-size: 0.75rem;
}

${select('[data-slot="card"]')} {
  gap: 0.75rem;
  padding-block: 0.75rem;
}

${select('[data-slot="card-header"]')},
${select('[data-slot="card-content"]')},
${select('[data-slot="card-footer"]')} {
  padding-inline: 0.75rem;
}

${select('[data-slot="card-header"]')} {
  gap: 0.25rem;
}

${select('[data-slot="tabs"]')} {
  gap: 0.5rem;
}

${select('[data-slot="tabs-list"]')} {
  height: 1.875rem;
}

${select('[data-slot="tabs-trigger"]')} {
  padding-inline: 0.5rem;
  font-size: 0.75rem;
}

${select('[data-slot="radio-group"]')} {
  gap: 0.5rem;
}

${select('[data-slot="switch-control"]')} {
  width: 2rem;
  height: 1.125rem;
}

${select('[data-slot="switch-thumb"]')} {
  width: 0.875rem;
  height: 0.875rem;
}
`
    case 'vega':
    default:
      return `
${select(':root')} {
  --radius-component: var(--radius);
}
`
  }
}
