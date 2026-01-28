# Integration Guide

This guide will help you integrate and use `shadcn-solid-components` in your SolidJS project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [TailwindCSS Configuration](#tailwindcss-configuration)
- [Basic Usage](#basic-usage)
- [Theming](#theming)
- [Complete Examples](#complete-examples)
- [FAQ](#faq)

## Prerequisites

- Node.js >= 18
- A SolidJS project
- TailwindCSS v4.0 or higher
- Modern browser support (Safari 16.4+, Chrome 111+, Firefox 128+)

## Installation

### 1. Install the Component Library

```bash
npm install shadcn-solid-components
# or
yarn add shadcn-solid-components
# or
pnpm add shadcn-solid-components
```

### 2. Install Peer Dependencies

The library requires the following peer dependencies:

```bash
npm install solid-js tailwindcss@^4.0.0 tw-animate-css
# or
yarn add solid-js tailwindcss@^4.0.0 tw-animate-css
# or
pnpm add solid-js tailwindcss@^4.0.0 tw-animate-css
```

## TailwindCSS Configuration

### Method 1: Using Vite (Recommended)

If you're using Vite as your build tool:

#### Step 1: Install Vite TailwindCSS Plugin

```bash
npm install -D @tailwindcss/vite
```

#### Step 2: Configure vite.config.ts

```typescript
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    solid(),
    tailwindcss(),
  ],
})
```

#### Step 3: Create or Update Your CSS File

In your main CSS file (usually `src/index.css` or `src/app.css`):

```css
@import "tailwindcss";
@import "shadcn-solid-components/tailwind.preset.css";

/* Your custom styles */
```

#### Step 4: Import CSS in Entry File

```typescript
// src/index.tsx or src/main.tsx
import './index.css'
import { render } from 'solid-js/web'
import App from './App'

render(() => <App />, document.getElementById('root')!)
```

### Method 2: Using PostCSS

If you're using PostCSS to process CSS (e.g., with other build tools):

#### Step 1: Install Dependencies

```bash
npm install -D @tailwindcss/postcss postcss
```

> **Note:** TailwindCSS v4 uses `@tailwindcss/postcss` instead of the old `tailwindcss` PostCSS plugin. Autoprefixer is no longer needed as it's built-in.

#### Step 2: Create or Update Your CSS File

In your main CSS file (usually `src/index.css` or `src/app.css`):

```css
@import "tailwindcss";
@import "shadcn-solid-components/tailwind.preset.css";

/* Your custom styles */
```

#### Step 3: Configure PostCSS

In `postcss.config.js`:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

> **Note:** TailwindCSS v4 no longer requires a `tailwind.config.js` file. Configuration is done through CSS using `@theme` and `@config` directives.

## Basic Usage

### Import Components

```typescript
import { Button, Alert, AlertDialog, Accordion } from 'shadcn-solid-components'
```

### Using the Button Component

```tsx
import { Button } from 'shadcn-solid-components'

function App() {
  return (
    <div>
      <Button variant="default" size="default">Default Button</Button>
      <Button variant="destructive" size="sm">Destructive Button</Button>
      <Button variant="outline" size="lg">Outline Button</Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="link">Link Button</Button>
    </div>
  )
}
```

### Using the Alert Component

```tsx
import { Alert, AlertTitle, AlertDescription } from 'shadcn-solid-components'

function App() {
  return (
    <Alert variant="default">
      <AlertTitle>Alert</AlertTitle>
      <AlertDescription>
        This is an alert message.
      </AlertDescription>
    </Alert>
  )
}
```

### Using the AlertDialog Component

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  Button
} from 'shadcn-solid-components'
import { createSignal } from 'solid-js'

function App() {
  const [open, setOpen] = createSignal(false)

  return (
    <AlertDialog open={open()} onOpenChange={setOpen}>
      <AlertDialogTrigger as={Button}>
        Open Dialog
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Action</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to proceed? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### Using the Accordion Component

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from 'shadcn-solid-components'

function App() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>
          Content for section 1.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>
          Content for section 2.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

## Theming

### Customizing CSS Variables

The component library uses CSS variables for theming. You can override these variables in your CSS file:

```css
@import "tailwindcss";
@import "shadcn-solid-components/tailwind.preset.css";

:root {
  /* Base Colors */
  --primary: oklch(0.5 0.2 250);
  --primary-foreground: oklch(0.98 0 0);

  /* Background Colors */
  --background: oklch(1 0 0);
  --foreground: oklch(0.15 0 0);

  /* Secondary Colors */
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.2 0 0);

  /* Accent Colors */
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.2 0 0);

  /* Destructive Color */
  --destructive: oklch(0.577 0.245 27.325);

  /* Border and Input */
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);

  /* Border Radius */
  --radius: 0.625rem;
}

/* Dark Theme */
[data-kb-theme="dark"] {
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... other dark theme variables */
}
```

### Enabling Dark Theme

Add the `data-kb-theme="dark"` attribute to your root element:

```tsx
import { createSignal } from 'solid-js'

function App() {
  const [isDark, setIsDark] = createSignal(false)

  return (
    <div data-kb-theme={isDark() ? 'dark' : undefined}>
      {/* Your app content */}
      <button onClick={() => setIsDark(!isDark())}>
        Toggle Theme
      </button>
    </div>
  )
}
```

### Using Custom Colors

You can also use TailwindCSS's arbitrary value syntax:

```tsx
<Button class="bg-[#ff0000] text-white">
  Custom Color Button
</Button>
```

## Complete Examples

### Example 1: Basic App Structure

```tsx
// src/App.tsx
import { Component } from 'solid-js'
import { Button } from 'shadcn-solid-components'
import './App.css'

const App: Component = () => {
  return (
    <div class="container mx-auto p-8">
      <h1 class="text-3xl font-bold mb-4">My App</h1>
      <Button variant="default">Click Me</Button>
    </div>
  )
}

export default App
```

```css
/* src/index.css */
@import "tailwindcss";
@import "shadcn-solid-components/tailwind.preset.css";
```

```typescript
// src/index.tsx
import { render } from 'solid-js/web'
import './index.css'
import App from './App'

render(() => <App />, document.getElementById('root')!)
```

### Example 2: Using Multiple Components

```tsx
import {
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from 'shadcn-solid-components'
import { createSignal } from 'solid-js'

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <div class="container mx-auto p-8 space-y-4">
      <h1 class="text-3xl font-bold">Component Examples</h1>

      <Alert variant="default">
        <AlertTitle>Counter</AlertTitle>
        <AlertDescription>
          Current count: {count()}
        </AlertDescription>
      </Alert>

      <div class="flex gap-2">
        <Button onClick={() => setCount(count() + 1)}>
          Increment
        </Button>
        <Button variant="outline" onClick={() => setCount(count() - 1)}>
          Decrement
        </Button>
        <Button variant="destructive" onClick={() => setCount(0)}>
          Reset
        </Button>
      </div>

      <Accordion>
        <AccordionItem value="info">
          <AccordionTrigger>About</AccordionTrigger>
          <AccordionContent>
            This is an example app built with shadcn-solid-components.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
```

## FAQ

### Q: Component styles are not working?

**A:** Make sure:

1. You've correctly imported the `tailwind.preset.css` file using `@import "shadcn-solid-components/tailwind.preset.css"`
2. TailwindCSS v4 is properly configured (using `@tailwindcss/vite` for Vite or `@tailwindcss/postcss` for PostCSS)
3. Your main CSS file includes `@import "tailwindcss"` before importing the preset
4. The CSS file is imported in your entry file
5. Your build tool is properly configured

### Q: How to customize component styles?

**A:** There are several ways:

1. Use the `class` prop to add custom classes
2. Override CSS variables to customize the theme
3. Use TailwindCSS's arbitrary value syntax

```tsx
<Button class="bg-blue-500 hover:bg-blue-600">
  Custom Style
</Button>
```

### Q: Dark theme is not working?

**A:** Make sure:

1. You've set the `data-kb-theme="dark"` attribute on the root element
2. CSS variables are properly defined
3. Components are inside the element with the attribute

### Q: How to import only specific components?

**A:** The library supports tree-shaking. You can directly import the components you need:

```typescript
import { Button } from 'shadcn-solid-components'
// Only Button is imported, other components won't be included
```

### Q: Is it compatible with TailwindCSS v3?

**A:** No. This component library requires TailwindCSS v4.0 or higher. TailwindCSS v4 introduces significant changes:

- Uses `@import "tailwindcss"` instead of `@tailwind` directives
- Configuration is done via CSS using `@theme` and `@config` directives
- Uses `@tailwindcss/vite` plugin for Vite projects
- Uses `@tailwindcss/postcss` plugin for PostCSS projects
- No longer requires `tailwind.config.js` file

If you're using TailwindCSS v3, you'll need to upgrade to v4. See the [TailwindCSS v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) for migration instructions.

### Q: How to add custom animations?

**A:** You can add custom animations in your CSS file:

```css
@keyframes my-animation {
  from { opacity: 0; }
  to { opacity: 1; }
}

@theme inline {
  --animate-my-animation: my-animation 0.3s ease-in-out;
}
```

Then use it in components:

```tsx
<div class="animate-my-animation">Content</div>
```

### Q: Do components support SSR?

**A:** Yes, the component library supports SolidJS SSR mode. Make sure TailwindCSS is properly configured in your SSR environment.

## Next Steps

- Check the [Component API documentation](./README.md) to learn about all available components
- Explore the [examples repository](https://github.com/your-username/shadcn-solid-components-examples) for more examples
- Submit an [Issue](https://github.com/your-username/shadcn-solid-components/issues) to report problems or suggestions

> **Note:** Replace `your-username` with your actual GitHub username in the links above.

## Getting Help

If you encounter issues:

1. Check the FAQ section in this document
2. Search [GitHub Issues](https://github.com/your-username/shadcn-solid-components/issues)
3. Create a new Issue describing your problem
