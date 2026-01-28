# shadcn-solid-components

A collection of SolidJS components built with TailwindCSS, inspired by shadcn/ui.

> 📖 **New to this library?** Check out the [Integration Guide](./INTEGRATION.md) for detailed setup instructions and examples.

## Installation

```bash
npm install shadcn-solid-components
# or
yarn add shadcn-solid-components
# or
pnpm add shadcn-solid-components
```

## Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install solid-js tailwindcss@^4.0.0 tw-animate-css
# or
yarn add solid-js tailwindcss@^4.0.0 tw-animate-css
# or
pnpm add solid-js tailwindcss@^4.0.0 tw-animate-css
```

## TailwindCSS Configuration

This component library requires TailwindCSS v4. You need to import the preset CSS file in your main CSS file:

### Option 1: Import the preset CSS file

In your main CSS file (e.g., `src/index.css` or `src/app.css`):

```css
@import "tailwindcss";
@import "shadcn-solid-components/tailwind.preset.css";

/* Your custom styles here */
```

### Option 2: Use with Vite

If you're using Vite with `@tailwindcss/vite` plugin:

```js
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    // ... other plugins
  ],
})
```

Then in your CSS file:

```css
@import "tailwindcss";
@import "shadcn-solid-components/tailwind.preset.css";
```

### Option 3: Using PostCSS

If you're using PostCSS (e.g., with other build tools):

```bash
npm install -D @tailwindcss/postcss postcss
```

Configure `postcss.config.js`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

Then in your CSS file:

```css
@import "tailwindcss";
@import "shadcn-solid-components/tailwind.preset.css";
```

> **Note:** TailwindCSS v4 no longer requires a `tailwind.config.js` file. Configuration is done through CSS using `@theme` and `@config` directives.

## Usage

```tsx
import { Button } from 'shadcn-solid-components'

function App() {
  return (
    <Button variant="default" size="default">
      Click me
    </Button>
  )
}
```

## Available Components

- **Button** - A versatile button component with multiple variants
- **Alert** - Display alert messages
- **AlertDialog** - Modal dialogs for alerts
- **Accordion** - Collapsible content sections

## Theming

The components use CSS variables for theming. You can customize the theme by overriding the CSS variables in your CSS file:

```css
:root {
  --primary: oklch(0.5 0.2 250);
  --background: oklch(1 0 0);
  /* ... other variables */
}
```

Dark mode is supported via the `data-kb-theme="dark"` attribute:

```tsx
<div data-kb-theme="dark">
  {/* Your app content */}
</div>
```

## Documentation

- [Integration Guide](./INTEGRATION.md) - Complete setup and integration guide
- [Component API](./README.md) - Component reference (this file)

## License

MIT
