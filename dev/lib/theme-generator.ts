import { BASE_COLORS, type BaseColor } from './base-colors'
import { generateStyleCss } from './theme-styles'
import { THEMES, type Theme } from './themes'

export const RADII = [
  { name: '0', label: '0', value: '0' },
  { name: '0.3rem', label: '0.3', value: '0.3rem' },
  { name: '0.5rem', label: '0.5', value: '0.5rem' },
  { name: '0.75rem', label: '0.75', value: '0.75rem' },
  { name: '1.0rem', label: '1.0', value: '1.0rem' },
] as const

export type Radius = (typeof RADII)[number]
export type RadiusValue = Radius['value']

export interface DesignSystemConfig {
  baseColor: string
  theme: string
  radius: string
  style?: string
}

export function getTheme(name: string) {
  return THEMES.find(theme => theme.name === name)
}

export function getBaseColor(name: string) {
  return BASE_COLORS.find(color => color.name === name)
}

export function generateThemeCssVars(config: DesignSystemConfig) {
  const baseColor = getBaseColor(config.baseColor)
  const theme = getTheme(config.theme)

  if (!baseColor || !theme) {
    throw new Error(`Base color "${config.baseColor}" or theme "${config.theme}" not found`)
  }

  // Merge base color and theme CSS vars.
  const lightVars: Record<string, string> = {
    ...(baseColor.cssVars?.light as Record<string, string>),
    ...(theme.cssVars?.light as Record<string, string>),
  }
  const darkVars: Record<string, string> = {
    ...(baseColor.cssVars?.dark as Record<string, string>),
    ...(theme.cssVars?.dark as Record<string, string>),
  }

  // Apply radius transformation.
  if (config.radius) {
    lightVars.radius = config.radius
  }

  return {
    light: lightVars,
    dark: darkVars,
  }
}

export function generatePresetCss(config: DesignSystemConfig) {
  const vars = generateThemeCssVars(config)
  const styleCss = generateStyleCss(config.style ?? 'vega').trim()

  const lightCss = Object.entries(vars.light)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n')

  const darkCss = Object.entries(vars.dark)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n')

  return `@import "tailwindcss";
@import "shadcn/tailwind.css";
@import "tw-animate-css";

@custom-variant dark (&:is([data-kb-theme="dark"] *));

@keyframes accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--kb-accordion-content-height);
  }
}

@keyframes accordion-up {
  from {
    height: var(--kb-accordion-content-height);
  }
  to {
    height: 0;
  }
}

@keyframes collapsible-down {
  from {
    height: 0;
  }
  to {
    height: var(--kb-collapsible-content-height);
  }
}

@keyframes collapsible-up {
  from {
    height: var(--kb-collapsible-content-height);
  }
  to {
    height: 0;
  }
}

@theme inline {
  /* Border Radius */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* Colors */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-surface: var(--surface);
  --color-surface-foreground: var(--surface-foreground);
  --color-code: var(--code);
  --color-code-foreground: var(--code-foreground);
  --color-code-highlight: var(--code-highlight);
  --color-code-number: var(--code-number);
  --color-selection: var(--selection);
  --color-selection-foreground: var(--selection-foreground);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  /* Font Family */
  --font-sans:
    "Inter Variable", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";

  /* Animations */
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;
  --animate-collapsible-down: collapsible-down 0.2s ease-out;
  --animate-collapsible-up: collapsible-up 0.2s ease-out;
}

:root {
  --radius-component: var(--radius);
${lightCss}
}

[data-kb-theme="dark"] {
${darkCss}
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }
}

@utility rounded-component {
  border-radius: var(--radius-component);
}

@utility rounded-t-component {
  border-top-left-radius: var(--radius-component);
  border-top-right-radius: var(--radius-component);
}

@utility rounded-r-component {
  border-top-right-radius: var(--radius-component);
  border-bottom-right-radius: var(--radius-component);
}

@utility rounded-l-component {
  border-top-left-radius: var(--radius-component);
  border-bottom-left-radius: var(--radius-component);
}

@utility rounded-b-component {
  border-bottom-left-radius: var(--radius-component);
  border-bottom-right-radius: var(--radius-component);
}

${styleCss}
`
}
