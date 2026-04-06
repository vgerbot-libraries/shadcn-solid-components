# shadcn-solid-components

A collection of SolidJS components built with TailwindCSS, inspired by shadcn/ui.

## Installation

```bash
npm install github:vgerbot-libraries/shadcn-solid-components
# or
yarn add github:vgerbot-libraries/shadcn-solid-components
# or
pnpm add github:vgerbot-libraries/shadcn-solid-components
```

> **Note:** GitHub installs build the package from source during installation. If your `pnpm` workspace restricts dependency build scripts with `onlyBuiltDependencies`, allow `shadcn-solid-components` first or run `pnpm approve-builds`.

```yaml
onlyBuiltDependencies:
  - shadcn-solid-components
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
@import "shadcn-solid-components/src/themes/default.preset.css";

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
@import "shadcn-solid-components/src/themes/default.preset.css";
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
@import "shadcn-solid-components/src/themes/default.preset.css";
```

> **Note:** TailwindCSS v4 no longer requires a `tailwind.config.js` file. Configuration is done through CSS using `@theme` and `@config` directives.

## Usage

```tsx
import { Button } from 'shadcn-solid-components/components/button'

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

<https://vgerbot-libraries.github.io/shadcn-solid-components/>

## License

MIT
