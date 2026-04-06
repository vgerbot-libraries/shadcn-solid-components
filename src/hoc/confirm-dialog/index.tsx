import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'shadcn-solid-components/components/alert-dialog'
import { buttonVariants } from 'shadcn-solid-components/components/button'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import type { ConfirmDialogLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { createSignal, type JSX, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export type ConfirmDialogVariant = 'default' | 'destructive'

export interface ConfirmDialogOptions {
  title: string
  description?: string | JSX.Element
  /** Visual variant. `'destructive'` styles the confirm button red. */
  variant?: ConfirmDialogVariant
  /** Label overrides for the confirm / cancel buttons. */
  locale?: Partial<ConfirmDialogLocale>
  /** Extra class applied to the confirm button. */
  confirmClass?: string
  /** Extra class applied to the cancel button. */
  cancelClass?: string
}

type ResolveReject = {
  resolve: (confirmed: boolean) => void
}

// ============================================================================
// State
// ============================================================================

const [dialogState, setDialogState] = createSignal<(ConfirmDialogOptions & ResolveReject) | null>(
  null,
)

// ============================================================================
// Imperative API
// ============================================================================

/**
 * Show a confirmation dialog and return a promise that resolves to `true`
 * (confirmed) or `false` (cancelled / dismissed).
 *
 * @example
 * ```tsx
 * const ok = await confirm({ title: 'Delete item?', variant: 'destructive' })
 * if (ok) deleteItem()
 * ```
 */
export function confirm(options: ConfirmDialogOptions): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    setDialogState({ ...options, resolve })
  })
}

// ============================================================================
// Component (mount once at app root)
// ============================================================================

/**
 * Renders the shared confirmation dialog. Place this once near your app root,
 * alongside `<Toaster />`.
 *
 * @example
 * ```tsx
 * <App>
 *   <ConfirmDialog />
 * </App>
 * ```
 */
export function ConfirmDialog() {
  const handleClose = (confirmed: boolean) => {
    const state = dialogState()
    state?.resolve(confirmed)
    setDialogState(null)
  }

  const locale = (): ConfirmDialogLocale => ({
    ...defaultLocale,
    ...useLocale().ConfirmDialog,
    ...dialogState()?.locale,
  })

  return (
    <Portal>
      <AlertDialog
        open={dialogState() !== null}
        onOpenChange={open => {
          if (!open) handleClose(false)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogState()?.title}</AlertDialogTitle>
            <Show when={dialogState()?.description}>
              <AlertDialogDescription>{dialogState()?.description}</AlertDialogDescription>
            </Show>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              class={dialogState()?.cancelClass}
              onClick={() => handleClose(false)}
            >
              {locale().cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              class={cx(
                dialogState()?.variant === 'destructive' &&
                  buttonVariants({ variant: 'destructive' }),
                dialogState()?.confirmClass,
              )}
              onClick={() => handleClose(true)}
            >
              {locale().confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Portal>
  )
}
