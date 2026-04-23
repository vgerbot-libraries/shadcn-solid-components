# shadcn-solid-components

A SolidJS component library inspired by shadcn/ui, built for Tailwind CSS v4.

## Features

- Rich primitive components under `components/*`
- Reusable higher-order modules under `hoc/*`
- Theme presets and CSS variable-based theming
- Dark mode via `data-kb-theme="dark"`

## Installation

Install from GitHub:

```bash
# npm
npm install github:vgerbot-libraries/shadcn-solid-components

# pnpm
pnpm add github:vgerbot-libraries/shadcn-solid-components

# yarn
yarn add github:vgerbot-libraries/shadcn-solid-components
```

Install required peers:

```bash
# npm
npm install solid-js tailwindcss@^4.0.0 tw-animate-css

# pnpm
pnpm add solid-js tailwindcss@^4.0.0 tw-animate-css

# yarn
yarn add solid-js tailwindcss@^4.0.0 tw-animate-css
```

> This package exposes many optional peer dependencies (for advanced components such as table/chart/calendar ecosystems). Install those only when using related modules.

## Tailwind CSS v4 setup

Import Tailwind and a preset stylesheet in your global CSS (for example, `src/index.css`):

```css
@import "tailwindcss";
@import "shadcn-solid-components/src/themes/default.preset.css";
```

Alternative preset:

```css
@import "tailwindcss";
@import "shadcn-solid-components/src/themes/supabase.preset.css";
```

> Tailwind CSS v4 does not require `tailwind.config.js` for this library's base setup.

## Quick start

```tsx
import { Button } from "shadcn-solid-components/components/button"

export default function App() {
  return <Button>Click me</Button>
}
```

## CLI: copy components into your project

You can use `ssc` to copy components/HOCs (with recursive dependencies) into your own source tree.

### List available items

```bash
npx ssc list
```

This lists all `components/*` and `hoc/*` entries with short descriptions.

### Add by arguments

```bash
# single
npx ssc add button

# multiple
npx ssc add button card data-table

# custom output directory
npx ssc add button --out-dir src/custom/ui

# preview only (no file writes)
npx ssc add button --dry-run
```

Default output directory is `src/lib/ssc`.

### Add without arguments

Run `ssc add` without component names to enter keyboard-driven selection mode:

```bash
npx ssc add
```

## Import conventions

- Base components: `shadcn-solid-components/components/<name>`
- HOCs / composed modules: `shadcn-solid-components/hoc/<name>`
- Utilities/hooks: `shadcn-solid-components/lib/<name>`

Examples:

```tsx
import { Button } from "shadcn-solid-components/components/button"
import { AppSidebar } from "shadcn-solid-components/hoc/app-sidebar"
import { useTheme } from "shadcn-solid-components/lib/use-theme"
```

## Theming

The library uses CSS variables (OKLCH-based values in presets). You can override tokens globally:

```css
:root {
  --primary: oklch(0.55 0.22 255);
  --background: oklch(1 0 0);
}
```

Enable dark mode with `data-kb-theme`:

```tsx
<div data-kb-theme="dark">
  {/* app content */}
</div>
```

## Documentation

- Docs site: <https://vgerbot-libraries.github.io/shadcn-solid-components/>

## License

MIT
