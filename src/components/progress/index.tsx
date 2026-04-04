import { Progress as ProgressPrimitive } from '@kobalte/core/progress'
import { type ComponentProps, splitProps, type ValidComponent } from 'solid-js'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import { cx } from 'shadcn-solid-components/lib/cva'

export type ProgressProps<T extends ValidComponent = 'div'> = ComponentProps<
  typeof ProgressPrimitive<T>
>

export const Progress = <T extends ValidComponent = 'div'>(props: ProgressProps<T>) => {
  const [, rest] = splitProps(props as ProgressProps, ['class', 'children'])
  const componentClass = useComponentClass(ComponentName.Progress, props as ProgressProps)

  return (
    <ProgressPrimitive
      data-slot="progress"
      class={cx('flex w-full flex-col gap-3', props.class)}
      {...rest}
    >
      {props.children}
      <ProgressPrimitive.Track
        data-slot="progress-track"
        class={cx(
          'bg-primary/20 relative h-2 w-full overflow-hidden',
          'rounded-component',
          componentClass,
        )}
      >
        <ProgressPrimitive.Fill
          data-slot="progress-fill"
          class="bg-primary h-full w-(--kb-progress-fill-width) transition-all"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive>
  )
}

export type ProgressGroupProps = ComponentProps<'div'>

export const ProgressGroup = (props: ProgressGroupProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div data-slot="progress-group" class={cx('flex justify-between', props.class)} {...rest} />
  )
}

export type ProgressLabelProps<T extends ValidComponent = 'span'> = ComponentProps<
  typeof ProgressPrimitive.Label<T>
>

export const ProgressLabel = <T extends ValidComponent = 'span'>(props: ProgressLabelProps<T>) => {
  const [, rest] = splitProps(props as ProgressLabelProps, ['class'])

  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      class={cx('text-sm font-medium select-none', props.class)}
      {...rest}
    />
  )
}

export type ProgressValueLabelProps<T extends ValidComponent = 'span'> = ComponentProps<
  typeof ProgressPrimitive.ValueLabel<T>
>

export const ProgressValueLabel = <T extends ValidComponent = 'span'>(
  props: ProgressValueLabelProps<T>,
) => {
  const [, rest] = splitProps(props as ProgressValueLabelProps, ['class'])

  return (
    <ProgressPrimitive.ValueLabel
      data-slot="progress-value-label"
      class={cx('text-sm font-medium select-none', props.class)}
      {...rest}
    />
  )
}
