# shadcn-solid-components Coding Conventions

This document defines the coding conventions for the shadcn-solid-components project. Follow these rules to ensure consistency when adding new components or modifying existing ones.

---

## 1. Project Structure

```
src/
├── components/<name>/     # Primitive components (shadcn/ui primitive layer)
│   ├── index.tsx          # Component code (required)
│   ├── _metadata.json     # Metadata (required)
│   ├── index.css          # Custom CSS (only when Tailwind alone is insufficient)
│   └── locales/           # Locale files (only when component has user-facing text)
├── hoc/<name>/            # Higher-order / composed components
│   ├── index.tsx          # Component code (required)
│   ├── _metadata.json     # Metadata (required)
│   └── locales/           # Locale files (required when component has user-facing text)
│       ├── en-US.ts
│       ├── ja-JP.ts
│       ├── zh-CN.ts
│       └── zh-TW.ts
├── lib/                   # Utility functions, hooks, shared logic
├── i18n/                  # i18n type definitions and global locale aggregation
│   ├── types.ts
│   └── locales/
├── themes/                # CSS theme presets
│   ├── base.css
│   ├── default.preset.css
│   └── supabase.preset.css
```

### Rules

- **`components/`** — Primitive layer. Wraps headless primitives (`@kobalte/core`, `@ark-ui/solid`, `@corvu/*`, etc.) with styling. Must not depend on other `components/` or `hoc/` modules.
- **`hoc/`** — Composition layer. Composes multiple `components/` primitives into higher-level UI patterns. Must import from `components/`, not from headless primitives directly.
- **`lib/`** — Shared utilities. No UI rendering logic.
- **`themes/`** — CSS presets only. No TypeScript.

---

## 2. Component Coding Pattern (components layer)

### 2.1 Polymorphic Generic Signature

All components that accept an `as` prop must use the polymorphic generic pattern:

```tsx
export type ButtonProps<T extends ValidComponent = 'button'> = ComponentProps<
  typeof ButtonPrimitive<T>
> &
  VariantProps<typeof buttonVariants>

export const Button = <T extends ValidComponent = 'button'>(props: ButtonProps<T>) => {
  // ...
}
```

For components without an `as` prop (e.g. simple `div` wrappers), use plain types:

```tsx
export type CardProps = ComponentProps<'div'>

export const Card = (props: CardProps) => {
  // ...
}
```

### 2.2 splitProps Pattern

Always separate custom props from rest props using `splitProps`. The destructured `rest` is spread onto the primitive element:

```tsx
const [, rest] = splitProps(props as ButtonProps, ['class', 'variant', 'size'])
```

When `mergeProps` is needed for defaults, split from the merged object:

```tsx
const merge = mergeProps({ showCloseButton: true } as DialogContentProps, props)
const [, rest] = splitProps(merge, ['class', 'children', 'showCloseButton'])
```

### 2.3 data-slot Attribute

Every sub-component's root element **must** include a `data-slot` attribute for CSS selector targeting:

```tsx
<DialogPrimitive.Content data-slot="dialog-content" ...>
<AccordionPrimitive.Item data-slot="accordion-item" ...>
```

Naming convention: `data-slot="<component>-<sub>"` (e.g. `dialog-content`, `accordion-trigger`).

### 2.4 class Composition Order

Use `cx()` from `shadcn-solid-components/lib/cva` to compose classes in this exact order:

```tsx
class={cx(
  buttonVariants({ variant: props.variant, size: props.size }),  // 1. Variant styles (or base Tailwind classes)
  'rounded-component',                                            // 2. Theme-aware border-radius
  componentClass,                                                 // 3. Theme override from useComponentClass
  props.class,                                                    // 4. User class (always last)
)}
```

For components without variants, the first argument is the base Tailwind class string:

```tsx
class={cx(
  'bg-card text-card-foreground flex flex-col gap-6 border py-6 shadow-sm',
  'rounded-component',
  componentClass,
  props.class,
)}
```

### 2.5 Theme Integration

Components that support theme overrides must call `useComponentClass`:

```tsx
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'

const componentClass = useComponentClass(ComponentName.Button, props as ButtonProps)
```

### 2.6 Variant System

Components with visual variants (e.g. size, color) must define variants using `cva()` and export them:

```tsx
import { cva } from 'shadcn-solid-components/lib/cva'

export const buttonVariants = cva({
  base: ['inline-flex items-center justify-center ...'],
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-white hover:bg-destructive/90',
      // ...
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 gap-1.5 px-3',
      // ...
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})
```

The `base` array format is preferred over a single string for readability when multiple logical groups exist.

### 2.7 Inline SVG Icons

Icons embedded directly in components must follow this pattern:

```tsx
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M18 6L6 18M6 6l12 12"
  />
</svg>
```

Attributes: `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`.

### 2.8 Re-exporting Primitive Sub-components

When a primitive sub-component needs no styling changes, re-export it directly:

```tsx
export const DialogPortal = DialogPrimitive.Portal
```

When it only needs a `data-slot`, wrap it minimally:

```tsx
export const Dialog = (props: DialogProps) => {
  return <DialogPrimitive data-slot="dialog" {...props} />
}
```

---

## 3. HOC Coding Pattern (hoc layer)

### 3.1 Compose, Don't Create

HOCs must build on `components/` layer primitives. Never import headless primitives directly:

```tsx
// ✅ Correct
import { AlertDialog, AlertDialogContent } from 'shadcn-solid-components/components/alert-dialog'
import { buttonVariants } from 'shadcn-solid-components/components/button'

// ❌ Wrong
import { Dialog as AlertDialogPrimitive } from '@kobalte/core/alert-dialog'
```

### 3.2 i18n Integration

Any HOC with user-visible text must support localization:

1. Define the locale type in `src/i18n/types.ts` (e.g. `ConfirmDialogLocale`)
2. Create locale files in `locales/` directory (en-US, ja-JP, zh-CN, zh-TW)
3. Read global locale via `useLocale()`, fallback to built-in default:

```tsx
const locale = (): ConfirmDialogLocale => ({
  ...defaultLocale,                    // Built-in default
  ...useLocale().ConfirmDialog,        // Global override from ConfigProvider
  ...dialogState()?.locale,            // Per-call override
})
```

### 3.3 Locale File Convention

Each locale file must:

- Import the type from `shadcn-solid-components/i18n/types`
- Export a named constant using camelCase locale code

```tsx
// locales/en-US.ts
import type { ConfirmDialogLocale } from 'shadcn-solid-components/i18n/types'

export const enUS: ConfirmDialogLocale = {
  confirm: 'Continue',
  cancel: 'Cancel',
}
```

```tsx
// locales/zh-CN.ts
import type { ConfirmDialogLocale } from 'shadcn-solid-components/i18n/types'

export const zhCN: ConfirmDialogLocale = {
  confirm: '确认',
  cancel: '取消',
}
```

Naming: file = kebab-case (`en-US.ts`), export = camelCase (`enUS`, `zhCN`, `zhTW`, `jaJP`).

### 3.4 Global Locale Aggregation

After adding a new HOC with locale support, update the global locale files in `src/i18n/locales/`:

```tsx
// src/i18n/locales/en-US.ts
import { enUS as ConfirmDialog } from 'shadcn-solid-components/hoc/confirm-dialog/locales/en-US'
// ... add to the enUS: Locale object
```

Also add the field to the `Locale` interface in `src/i18n/types.ts`.

### 3.5 Imperative API Pattern

For HOCs that need imperative invocation (e.g. `confirm()`), use the signal + Promise pattern:

```tsx
const [dialogState, setDialogState] = createSignal<(Options & ResolveReject) | null>(null)

export function confirm(options: Options): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    setDialogState({ ...options, resolve })
  })
}
```

The rendering component reads from the signal and resolves the promise on user action.

### 3.6 Code Section Separation

Use `// ============` comment blocks to separate logical sections:

```tsx
// ============================================================================
// Types
// ============================================================================

// ============================================================================
// State
// ============================================================================

// ============================================================================
// Imperative API
// ============================================================================

// ============================================================================
// Component
// ============================================================================
```

---

## 4. Import Path Conventions

| Source | Import Style | Example |
|---|---|---|
| Cross-module internal | `shadcn-solid-components/...` alias | `import { cx } from 'shadcn-solid-components/lib/cva'` |
| Same directory | Relative path | `import { Button } from '../button'` |
| Locale in same module | Relative path | `import { enUS as defaultLocale } from './locales/en-US'` |
| Third-party | Package name | `import { Dialog } from '@kobalte/core/dialog'` |
| SolidJS | Package name | `import { splitProps } from 'solid-js'` |

**Never** use relative paths for cross-module imports (e.g. do not use `../../lib/cva` — use `shadcn-solid-components/lib/cva`).

---

## 5. Theme System Integration

When adding a new component, you **must** update all three files:

### 5.1 `src/lib/theme-context.ts`

Add an entry to the `ComponentName` object:

```tsx
export const ComponentName = {
  // ...existing entries
  MyNewComponent: 'MyNewComponent',
} as const
```

### 5.2 `src/lib/component-props-map.ts`

Add a type import and a mapping entry:

```tsx
import type { MyNewComponentProps } from '../components/my-new-component'

export interface ComponentPropsMap {
  // ...existing entries
  [ComponentName.MyNewComponent]: MyNewComponentProps
}
```

### 5.3 `package.json` exports

Add an export path:

```json
{
  "exports": {
    "./components/my-new-component": "./src/components/my-new-component/index.tsx"
  }
}
```

---

## 6. _metadata.json Specification

Every component and HOC must include a `_metadata.json` file with these fields:

```json
{
  "name": "components/button",
  "displayName": "Button",
  "description": "The primary interactive element for triggering actions. Provides six visual variants...",
  "category": "components",
  "useCases": [
    "Primary form submission, save, cancel, and next-step actions",
    "Destructive variant for dangerous actions such as delete or remove",
    "Icon variants for compact toolbar buttons",
    "Ghost and link variants for low-emphasis actions"
  ],
  "usage": "import { Button, buttonVariants } from \"shadcn-solid-components/components/button\"",
  "tags": ["components", "button", "solidjs", "ui"]
}
```

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Module path: `components/<name>` or `hoc/<name>` |
| `displayName` | `string` | Human-readable name (PascalCase) |
| `description` | `string` | English description of functionality |
| `category` | `string` | `"components"` or `"hoc"` |
| `useCases` | `string[]` | 3–4 typical usage scenarios |
| `usage` | `string` | Import example code |
| `tags` | `string[]` | Searchable tags |

---

## 7. Styling Conventions

### 7.1 Tailwind First

Use Tailwind CSS utility classes as the primary styling mechanism. Only write custom CSS when Tailwind cannot express the desired style.

### 7.2 When Custom CSS Is Allowed

- Animation `@keyframes` definitions
- Complex pseudo-class / attribute selectors (e.g. `[data-pinned-border="left"]`)
- CSS variable references that Tailwind cannot generate
- Component-specific utility definitions

Custom CSS files must be named `index.css` and placed in the component directory. Import them in the component:

```tsx
import './index.css'
```

### 7.3 Border Radius

Always use the theme-aware border-radius utilities instead of hardcoded Tailwind values:

- `rounded-component` — all corners
- `rounded-t-component` — top corners
- `rounded-b-component` — bottom corners
- `rounded-l-component` — left corners
- `rounded-r-component` — right corners

These resolve to `var(--radius-component)` which respects the theme's `base.radius` setting.

### 7.4 data-slot CSS Selectors

When custom CSS needs to target specific sub-components, use `[data-slot="..."]` selectors:

```css
[data-slot="tanstack-table-resize-handle"]:hover {
  background-color: var(--color-border);
}
```

### 7.5 Dark Mode

Use the `dark:` variant prefix. The project defines a custom variant:

```css
@custom-variant dark (&:is([data-kb-theme="dark"] *));
```

Do **not** use `@media (prefers-color-scheme: dark)`.

---

## 8. Code Formatting

The project uses Biome for formatting and linting. Key settings (from `biome.json` and `.editorconfig`):

| Setting | Value |
|---|---|
| Indent | 2 spaces |
| Line ending | LF |
| Line width | 100 characters |
| JS quote style | Single quotes |
| JSX attribute quotes | Double quotes |
| Semicolons | As needed (omit when safe) |
| Trailing commas | Always |
| Arrow parens | As needed (omit for single param) |
| Charset | UTF-8 |
| Trim trailing whitespace | Yes |
| Insert final newline | Yes |

Run formatting and linting before committing:

```bash
pnpm format    # biome format --write ./src ./dev
pnpm lint      # biome check --write ./src && tsc --noEmit
```

---

## 9. Testing Conventions

- Test files live in the `test/` directory at the project root
- Naming: `<name>.test.ts(x)`
- Client tests: jsdom environment, run with `pnpm test:client`
- SSR tests: node environment, file must be named `server.test.ts(x)`, run with `pnpm test:ssr`
- All tests: `pnpm test`

---

## 10. New Component Checklist

When adding a new component, ensure all of the following are completed:

- [ ] `src/components/<name>/index.tsx` — Component implementation
- [ ] `src/components/<name>/_metadata.json` — Metadata file
- [ ] `src/lib/theme-context.ts` — Add entry to `ComponentName` object
- [ ] `src/lib/component-props-map.ts` — Add type import and `ComponentPropsMap` entry
- [ ] `package.json` — Add entry to `exports` field
- [ ] If the component has visual variants: export `xxxVariants` for external use
- [ ] If the component needs custom CSS: create `index.css` in the component directory

When adding a new HOC, additionally:

- [ ] If the HOC has user-facing text: add locale type to `src/i18n/types.ts`
- [ ] Create `locales/` directory with all four locale files (en-US, ja-JP, zh-CN, zh-TW)
- [ ] Update all global locale files in `src/i18n/locales/`
- [ ] Add the locale field to the `Locale` interface in `src/i18n/types.ts`
