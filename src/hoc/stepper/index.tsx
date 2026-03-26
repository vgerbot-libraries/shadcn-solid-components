import {
  type Accessor,
  type ComponentProps,
  createContext,
  createSignal,
  For,
  type JSX,
  Show,
  splitProps,
  useContext,
} from 'solid-js'
import { Button } from '@/components/button'
import { useLocale } from '@/components/config-provider'
import { Separator } from '@/components/separator'
import type { StepperLocale } from '@/i18n/types'
import { cx } from '@/lib/cva'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================

export const enLocale: StepperLocale = {
  next: 'Next',
  previous: 'Previous',
  finish: 'Finish',
  stepOf: (current, total) => `Step ${current} of ${total}`,
}

export const zhCNLocale: StepperLocale = {
  next: '下一步',
  previous: '上一步',
  finish: '完成',
  stepOf: (current, total) => `第 ${current} 步，共 ${total} 步`,
}

export const zhTWLocale: StepperLocale = {
  next: '下一步',
  previous: '上一步',
  finish: '完成',
  stepOf: (current, total) => `第 ${current} 步，共 ${total} 步`,
}

export const jaLocale: StepperLocale = {
  next: '次へ',
  previous: '戻る',
  finish: '完了',
  stepOf: (current, total) => `${total} 中 ${current} ステップ`,
}

// ============================================================================
// Types
// ============================================================================

export interface StepItem {
  /** Step label. */
  label: string
  /** Optional description shown below the label. */
  description?: string
  /** Optional icon for the step indicator. If omitted, the step number is shown. */
  icon?: JSX.Element
  /** Content rendered when this step is active. */
  content: JSX.Element
  /**
   * Async validation function called before advancing to the next step.
   * Return `true` to allow advancing, `false` to block.
   */
  validate?: () => boolean | Promise<boolean>
}

export type StepperVariant = 'default' | 'circle' | 'dot'
export type StepperOrientation = 'horizontal' | 'vertical'

export interface StepperProps extends ComponentProps<'div'> {
  /** The array of step definitions. */
  steps: StepItem[]
  /** Controlled active step index (0-based). */
  activeStep?: number
  /** Called when the active step changes. */
  onActiveStepChange?: (step: number) => void
  /** Visual variant for the step indicators. Defaults to `'default'`. */
  variant?: StepperVariant
  /** Layout orientation. Defaults to `'horizontal'`. */
  orientation?: StepperOrientation
  /** Allow clicking on completed steps to navigate back. Defaults to `true`. */
  clickable?: boolean
  /** Show built-in navigation buttons. Defaults to `true`. */
  showNavigation?: boolean
  /** Called when the last step is completed. */
  onComplete?: () => void
  /** Locale overrides. */
  locale?: Partial<StepperLocale>
}

/** Imperative API returned by `useStepper`. */
export interface StepperApi {
  activeStep: Accessor<number>
  totalSteps: number
  isFirst: Accessor<boolean>
  isLast: Accessor<boolean>
  next: () => Promise<boolean>
  prev: () => void
  goTo: (step: number) => void
}

// ============================================================================
// Context
// ============================================================================

const StepperCtx = createContext<StepperApi>()

/** Access the stepper API from within a step's content. */
export function useStepper(): StepperApi {
  const ctx = useContext(StepperCtx)
  if (!ctx) throw new Error('useStepper must be used within a <Stepper>')
  return ctx
}

// ============================================================================
// Helpers
// ============================================================================

function StepIndicator(props: {
  index: number
  active: boolean
  completed: boolean
  variant: StepperVariant
  icon?: JSX.Element
}) {
  const number = () => props.index + 1

  return (
    <div
      class={cx(
        'flex shrink-0 items-center justify-center font-medium transition-colors',
        props.variant === 'dot' && 'size-3 rounded-full',
        props.variant === 'circle' && 'size-8 rounded-full text-sm',
        props.variant === 'default' && 'size-8 rounded-full text-sm',
        props.completed && 'bg-primary text-primary-foreground',
        props.active && !props.completed && 'bg-primary text-primary-foreground',
        !props.active && !props.completed && 'bg-muted text-muted-foreground',
      )}
    >
      <Show when={props.variant !== 'dot'}>
        <Show
          when={!props.completed}
          fallback={
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12l5 5L20 7"
              />
            </svg>
          }
        >
          <Show when={props.icon} fallback={number()}>
            {props.icon}
          </Show>
        </Show>
      </Show>
    </div>
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * A multi-step wizard with progress indicator, per-step validation,
 * and built-in navigation.
 *
 * @example
 * ```tsx
 * <Stepper
 *   steps={[
 *     { label: 'Account', content: <AccountForm /> },
 *     { label: 'Profile', content: <ProfileForm />, validate: () => isValid() },
 *     { label: 'Review', content: <ReviewStep /> },
 *   ]}
 *   onComplete={() => handleSubmit()}
 * />
 * ```
 */
export function Stepper(props: StepperProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'steps',
    'activeStep',
    'onActiveStepChange',
    'variant',
    'orientation',
    'clickable',
    'showNavigation',
    'onComplete',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): StepperLocale => ({
    ...defaultLocale,
    ...globalLocale.Stepper,
    ...local.locale,
  })
  const variant = () => local.variant ?? 'default'
  const orientation = () => local.orientation ?? 'horizontal'
  const clickable = () => local.clickable !== false
  const showNav = () => local.showNavigation !== false

  const isControlled = () => local.activeStep !== undefined
  const [internalStep, setInternalStep] = createSignal(0)

  const activeStep = () => (isControlled() ? local.activeStep! : internalStep())
  const setActiveStep = (step: number) => {
    if (!isControlled()) setInternalStep(step)
    local.onActiveStepChange?.(step)
  }

  const totalSteps = () => local.steps.length
  const isFirst = () => activeStep() === 0
  const isLast = () => activeStep() === totalSteps() - 1

  const next = async (): Promise<boolean> => {
    const current = local.steps[activeStep()]
    if (current?.validate) {
      const valid = await current.validate()
      if (!valid) return false
    }
    if (isLast()) {
      local.onComplete?.()
      return true
    }
    setActiveStep(activeStep() + 1)
    return true
  }

  const prev = () => {
    if (!isFirst()) setActiveStep(activeStep() - 1)
  }

  const goTo = (step: number) => {
    if (step >= 0 && step < totalSteps() && step <= activeStep()) {
      setActiveStep(step)
    }
  }

  const api: StepperApi = {
    activeStep,
    totalSteps: totalSteps(),
    isFirst,
    isLast,
    next,
    prev,
    goTo,
  }

  return (
    <StepperCtx.Provider value={api}>
      <div data-slot="stepper" class={cx('flex flex-col gap-6', local.class)} {...rest}>
        {/* Step indicators */}
        <div
          class={cx('flex items-center', orientation() === 'vertical' && 'flex-col items-start')}
          role="list"
          aria-label={locale().stepOf(activeStep() + 1, totalSteps())}
        >
          <For each={local.steps}>
            {(step, index) => {
              const isActive = () => index() === activeStep()
              const isCompleted = () => index() < activeStep()

              return (
                <>
                  <Show when={index() > 0}>
                    <Separator
                      class={cx(
                        orientation() === 'horizontal' ? 'mx-2 flex-1' : 'my-2 ml-4',
                        isCompleted() ? 'bg-primary' : 'bg-muted',
                      )}
                      orientation={orientation() === 'horizontal' ? 'horizontal' : 'vertical'}
                    />
                  </Show>
                  <button
                    type="button"
                    role="listitem"
                    class={cx(
                      'flex items-center gap-2 rounded-md px-2 py-1 text-left transition-colors',
                      clickable() && isCompleted() && 'cursor-pointer hover:bg-accent',
                      !clickable() || (!isCompleted() && !isActive()) ? 'cursor-default' : '',
                    )}
                    aria-current={isActive() ? 'step' : undefined}
                    onClick={() => {
                      if (clickable() && isCompleted()) goTo(index())
                    }}
                  >
                    <StepIndicator
                      index={index()}
                      active={isActive()}
                      completed={isCompleted()}
                      variant={variant()}
                      icon={step.icon}
                    />
                    <Show when={variant() !== 'dot'}>
                      <div class="flex flex-col">
                        <span
                          class={cx(
                            'text-sm font-medium',
                            !isActive() && !isCompleted() && 'text-muted-foreground',
                          )}
                        >
                          {step.label}
                        </span>
                        <Show when={step.description}>
                          <span class="text-muted-foreground text-xs">{step.description}</span>
                        </Show>
                      </div>
                    </Show>
                  </button>
                </>
              )
            }}
          </For>
        </div>

        {/* Step content */}
        <div data-slot="stepper-content" class="min-h-0">
          {local.steps[activeStep()]?.content}
        </div>

        {/* Navigation */}
        <Show when={showNav()}>
          <div class="flex items-center justify-between">
            <Button variant="outline" disabled={isFirst()} onClick={prev}>
              {locale().previous}
            </Button>
            <span class="text-muted-foreground text-sm">
              {locale().stepOf(activeStep() + 1, totalSteps())}
            </span>
            <Button onClick={next}>{isLast() ? locale().finish : locale().next}</Button>
          </div>
        </Show>
      </div>
    </StepperCtx.Provider>
  )
}
