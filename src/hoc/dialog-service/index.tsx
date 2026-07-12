import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'shadcn-solid-components/components/alert-dialog'
import { Button, type ButtonProps } from 'shadcn-solid-components/components/button'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import { Textarea } from 'shadcn-solid-components/components/textarea'
import type { DialogServiceLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { createEffect, createSignal, For, type JSX, onCleanup, onMount, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export type DialogServiceKind = 'alert' | 'confirm' | 'prompt'

export type DialogServiceDefaultActionKey = 'confirm' | 'cancel' | 'close'

export type DialogServiceActionKey = DialogServiceDefaultActionKey | (string & {})

export type DialogServiceConfirmVariant = 'default' | 'destructive'

export type PromptInputType = 'text' | 'password' | 'textarea' | 'datetime' | 'date' | 'time'

export type PromptInputRenderer = (setValue: (value: string) => void, value: string) => JSX.Element

export interface DialogServiceAction {
  actionKey: DialogServiceActionKey
  label: JSX.Element
  variant?: ButtonProps['variant']
  class?: string
  disabled?: boolean
  autofocus?: boolean
}

interface DialogServiceBaseOptions {
  title: string
  description?: string | JSX.Element
  locale?: Partial<DialogServiceLocale>
  dismissible?: boolean
  actions?: DialogServiceAction[]
  mergeDefaultActions?: boolean
}

export interface AlertDialogServiceOptions extends DialogServiceBaseOptions {}

export interface ConfirmDialogServiceOptions extends DialogServiceBaseOptions {
  variant?: DialogServiceConfirmVariant
}

export interface PromptDialogServiceOptions extends DialogServiceBaseOptions {
  input?: PromptInputType | PromptInputRenderer
  defaultValue?: string
  placeholder?: string
  required?: boolean
  confirmVariant?: DialogServiceConfirmVariant
  validate?: (value: string) => string | undefined
}

export interface DialogActionResult {
  actionKey: DialogServiceActionKey
  confirmed: boolean
}

export interface PromptDialogResult extends DialogActionResult {
  value: string
}

type DialogServiceRequest =
  | {
      id: number
      kind: 'alert'
      options: AlertDialogServiceOptions
      resolve: (result: DialogActionResult) => void
    }
  | {
      id: number
      kind: 'confirm'
      options: ConfirmDialogServiceOptions
      resolve: (result: DialogActionResult) => void
    }
  | {
      id: number
      kind: 'prompt'
      options: PromptDialogServiceOptions
      resolve: (result: PromptDialogResult) => void
    }

// ============================================================================
// State
// ============================================================================

let requestId = 0
let hasPrimaryHost = false

const [isHostMounted, setIsHostMounted] = createSignal(false)
const [, setQueue] = createSignal<DialogServiceRequest[]>([])
const [activeRequest, setActiveRequest] = createSignal<DialogServiceRequest | null>(null)

const [promptValue, setPromptValue] = createSignal('')
const [promptError, setPromptError] = createSignal<string | undefined>(undefined)

const isPromptRequest = (
  request: DialogServiceRequest | null,
): request is DialogServiceRequest & {
  kind: 'prompt'
} => request?.kind === 'prompt'

const isConfirmAction = (actionKey: DialogServiceActionKey): boolean => actionKey === 'confirm'

const processQueue = () => {
  if (!isHostMounted() || activeRequest() !== null) {
    return
  }

  setQueue(currentQueue => {
    if (currentQueue.length === 0) {
      return currentQueue
    }

    const [nextRequest, ...rest] = currentQueue
    if (!nextRequest) {
      return currentQueue
    }
    setActiveRequest(nextRequest)

    return rest
  })
}

const enqueueRequest = <TResult,>(
  kind: DialogServiceKind,
  options: AlertDialogServiceOptions | ConfirmDialogServiceOptions | PromptDialogServiceOptions,
): Promise<TResult> => {
  return new Promise<TResult>(resolve => {
    const request: DialogServiceRequest = {
      id: ++requestId,
      kind,
      options,
      resolve: resolve as (result: DialogActionResult | PromptDialogResult) => void,
    } as DialogServiceRequest

    setQueue(currentQueue => [...currentQueue, request])
    processQueue()
  })
}

// ============================================================================
// Imperative APIs
// ============================================================================

export const alert = (options: AlertDialogServiceOptions): Promise<DialogActionResult> =>
  enqueueRequest<DialogActionResult>('alert', options)

export const confirm = (options: ConfirmDialogServiceOptions): Promise<DialogActionResult> =>
  enqueueRequest<DialogActionResult>('confirm', options)

export const prompt = (options: PromptDialogServiceOptions): Promise<PromptDialogResult> =>
  enqueueRequest<PromptDialogResult>('prompt', options)

// ============================================================================
// Host
// ============================================================================

export function DialogServiceHost() {
  const [isPrimaryHost, setIsPrimaryHost] = createSignal(false)

  const locale = (): DialogServiceLocale => ({
    ...defaultLocale,
    ...useLocale().DialogService,
    ...activeRequest()?.options.locale,
  })

  onMount(() => {
    if (isPrimaryHost()) {
      return
    }

    if (hasPrimaryHost) {
      return
    }

    hasPrimaryHost = true
    setIsPrimaryHost(true)
    setIsHostMounted(true)
    processQueue()
  })

  onCleanup(() => {
    if (!isPrimaryHost()) {
      return
    }

    hasPrimaryHost = false
    setIsPrimaryHost(false)
    setIsHostMounted(false)
  })

  createEffect(() => {
    const request = activeRequest()

    if (!isPromptRequest(request)) {
      setPromptValue('')
      setPromptError(undefined)
      return
    }

    setPromptValue(request.options.defaultValue ?? '')

    const validationError = getPromptValidationError(
      request.options.defaultValue ?? '',
      request.options,
      locale(),
    )

    setPromptError(validationError)
  })

  const settleAndContinue = (result: DialogActionResult | PromptDialogResult) => {
    const request = activeRequest()
    if (!request) {
      return
    }

    request.resolve(result as never)
    setActiveRequest(null)
    processQueue()
  }

  const resolveDismiss = () => {
    const request = activeRequest()
    if (!request) {
      return
    }

    if (request.kind === 'prompt') {
      settleAndContinue({
        actionKey: 'close',
        confirmed: false,
        value: promptValue(),
      })
      return
    }

    settleAndContinue({
      actionKey: 'close',
      confirmed: false,
    })
  }

  const handleAction = (actionKey: DialogServiceActionKey) => {
    const request = activeRequest()
    if (!request) {
      return
    }

    if (request.kind === 'prompt') {
      const nextError = getPromptValidationError(promptValue(), request.options, locale())
      setPromptError(nextError)

      if (isConfirmAction(actionKey) && nextError) {
        return
      }

      settleAndContinue({
        actionKey,
        confirmed: isConfirmAction(actionKey),
        value: promptValue(),
      })
      return
    }

    settleAndContinue({
      actionKey,
      confirmed: isConfirmAction(actionKey),
    })
  }

  const actions = (): DialogServiceAction[] => {
    const request = activeRequest()
    if (!request) {
      return []
    }

    const defaultActions = getDefaultActions(request, locale())
    const customActions = request.options.actions ?? []

    if (customActions.length === 0) {
      return defaultActions
    }

    if (request.options.mergeDefaultActions) {
      return [...defaultActions, ...customActions]
    }

    return customActions
  }

  const requestDismissible = () => activeRequest()?.options.dismissible ?? true

  const promptOptions = (): PromptDialogServiceOptions | undefined => {
    const request = activeRequest()
    if (!isPromptRequest(request)) {
      return undefined
    }

    return request.options
  }

  const promptInput = (): PromptInputType | PromptInputRenderer => promptOptions()?.input ?? 'text'

  const promptInputType = (): PromptInputType => {
    const input = promptInput()
    if (typeof input === 'function') {
      return 'text'
    }

    return input
  }

  const nativePromptInputType = (): HTMLInputElement['type'] => {
    const inputType = promptInputType()
    if (inputType === 'datetime') {
      return 'datetime-local'
    }

    if (inputType === 'textarea') {
      return 'text'
    }

    return inputType
  }

  const setPromptValueWithValidation = (value: string) => {
    setPromptValue(value)

    const options = promptOptions()
    if (options) {
      setPromptError(getPromptValidationError(value, options, locale()))
    }
  }

  const isActionDisabled = (action: DialogServiceAction): boolean =>
    Boolean(
      action.disabled ||
        (isPromptRequest(activeRequest()) && isConfirmAction(action.actionKey) && promptError()),
    )

  return (
    <Show when={isPrimaryHost()}>
      <Portal>
        <AlertDialog
          open={activeRequest() !== null}
          onOpenChange={open => {
            if (!open && requestDismissible()) {
              resolveDismiss()
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{activeRequest()?.options.title}</AlertDialogTitle>
              <Show when={activeRequest()?.options.description}>
                <AlertDialogDescription>
                  {activeRequest()?.options.description}
                </AlertDialogDescription>
              </Show>
            </AlertDialogHeader>

            <Show when={isPromptRequest(activeRequest())}>
              <div class="grid gap-2">
                <Show
                  when={typeof promptInput() === 'function'}
                  fallback={
                    <Show
                      when={promptInputType() === 'textarea'}
                      fallback={
                        <input
                          data-slot="dialog-service-prompt-input"
                          name="dialog-service-prompt"
                          class={promptInputClass}
                          type={nativePromptInputType()}
                          value={promptValue()}
                          placeholder={promptOptions()?.placeholder}
                          onInput={(event: InputEvent & { currentTarget: HTMLInputElement }) =>
                            setPromptValueWithValidation(event.currentTarget.value)
                          }
                          autofocus
                        />
                      }
                    >
                      <Textarea
                        name="dialog-service-prompt"
                        value={promptValue()}
                        placeholder={promptOptions()?.placeholder}
                        onInput={(event: InputEvent & { currentTarget: HTMLTextAreaElement }) =>
                          setPromptValueWithValidation(event.currentTarget.value)
                        }
                        autofocus
                      />
                    </Show>
                  }
                >
                  {(() => {
                    const input = promptInput()
                    return typeof input === 'function'
                      ? input(setPromptValueWithValidation, promptValue())
                      : null
                  })()}
                </Show>
                <Show when={promptError()}>
                  <p class="text-destructive text-sm">{promptError()}</p>
                </Show>
              </div>
            </Show>

            <AlertDialogFooter>
              <For each={actions()}>
                {action => (
                  <Button
                    variant={action.variant}
                    class={cx(action.class)}
                    disabled={isActionDisabled(action)}
                    autofocus={action.autofocus}
                    onClick={() => handleAction(action.actionKey)}
                  >
                    {action.label}
                  </Button>
                )}
              </For>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Portal>
    </Show>
  )
}

const getPromptValidationError = (
  value: string,
  options: PromptDialogServiceOptions,
  locale: DialogServiceLocale,
): string | undefined => {
  if (options.required && value.trim().length === 0) {
    return locale.promptRequired
  }

  return options.validate?.(value)
}

const getDefaultActions = (
  request: DialogServiceRequest,
  locale: DialogServiceLocale,
): DialogServiceAction[] => {
  if (request.kind === 'alert') {
    return [
      {
        actionKey: 'close',
        label: locale.close,
        variant: 'default',
      },
    ]
  }

  if (request.kind === 'confirm') {
    return [
      {
        actionKey: 'cancel',
        label: locale.cancel,
        variant: 'outline',
      },
      {
        actionKey: 'confirm',
        label: locale.confirm,
        variant: request.options.variant === 'destructive' ? 'destructive' : 'default',
      },
    ]
  }

  return [
    {
      actionKey: 'cancel',
      label: locale.cancel,
      variant: 'outline',
    },
    {
      actionKey: 'confirm',
      label: locale.confirm,
      variant: request.options.confirmVariant === 'destructive' ? 'destructive' : 'default',
    },
  ]
}

const promptInputClass =
  'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-component'
