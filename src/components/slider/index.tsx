import { Slider as SliderPrimitive } from '@kobalte/core/slider'
import type { VoidProps } from 'solid-js'
import { type ComponentProps, splitProps, type ValidComponent } from 'solid-js'
import { ComponentName } from '@/lib/theme-context'
import { useComponentClass, useRadiusClass } from '@/lib/theme-helpers'
import { cx } from '@/registry/lib/cva'

export type SliderProps<T extends ValidComponent = 'div'> = ComponentProps<
  typeof SliderPrimitive<T>
>

export const Slider = <T extends ValidComponent = 'div'>(props: SliderProps<T>) => {
  const [, rest] = splitProps(props as SliderProps, ['class'])

  return (
    <SliderPrimitive
      data-slot="slider"
      class={cx(
        'relative flex w-full touch-none flex-col items-center gap-2 select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto',
        props.class,
      )}
      {...rest}
    />
  )
}

export type SliderTrackProps<T extends ValidComponent = 'div'> = ComponentProps<
  typeof SliderPrimitive.Track<T>
>

export const SliderTrack = <T extends ValidComponent = 'div'>(props: SliderTrackProps<T>) => {
  const [, rest] = splitProps(props as SliderTrackProps, ['class'])
  const radiusClass = useRadiusClass('special')
  const componentClass = useComponentClass(ComponentName.Slider, props as SliderProps)

  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      class={cx(
        'bg-muted relative data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-[inherit] data-[orientation=vertical]:min-h-[inherit] data-[orientation=vertical]:w-1.5',
        radiusClass,
        componentClass,
        props.class,
      )}
      {...rest}
    />
  )
}

export type SliderFillProps<T extends ValidComponent = 'div'> = VoidProps<
  ComponentProps<typeof SliderPrimitive.Fill<T>>
>

export const SliderFill = <T extends ValidComponent = 'div'>(props: SliderFillProps<T>) => {
  const [, rest] = splitProps(props as SliderFillProps, ['class'])
  const radiusClass = useRadiusClass('special')
  const componentClass = useComponentClass(ComponentName.Slider, props as SliderProps)

  return (
    <SliderPrimitive.Fill
      data-slot="slider-fill"
      class={cx(
        'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
        radiusClass,
        componentClass,
        props.class,
      )}
      {...rest}
    />
  )
}

export type SliderThumbProps<T extends ValidComponent = 'span'> = VoidProps<
  ComponentProps<typeof SliderPrimitive.Thumb<T>>
>

export const SliderThumb = <T extends ValidComponent = 'span'>(props: SliderThumbProps<T>) => {
  const [, rest] = splitProps(props as SliderThumbProps, ['class'])
  const radiusClass = useRadiusClass('special')
  const componentClass = useComponentClass(ComponentName.Slider, props as SliderProps)

  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      class={cx(
        'border-primary bg-background ring-ring/50 size-4 border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[orientation=horizontal]:-top-1 data-[orientation=vertical]:-left-1',
        radiusClass,
        componentClass,
        props.class,
      )}
      {...rest}
    >
      <SliderPrimitive.Input />
    </SliderPrimitive.Thumb>
  )
}

export type SliderGroupProps = ComponentProps<'div'>

export const SliderGroup = (props: SliderGroupProps) => {
  const [, rest] = splitProps(props, ['class'])

  return (
    <div
      data-slot="slider-group"
      class={cx('flex w-full justify-between', props.class)}
      {...rest}
    />
  )
}

export type SliderLabelProps<T extends ValidComponent = 'label'> = ComponentProps<
  typeof SliderPrimitive.Label<T>
>

export const SliderLabel = <T extends ValidComponent = 'label'>(props: SliderLabelProps<T>) => {
  const [, rest] = splitProps(props as SliderLabelProps, ['class'])

  return (
    <SliderPrimitive.Label
      data-slot="slider-label"
      class={cx('text-sm font-medium select-none', props.class)}
      {...rest}
    />
  )
}

export type SliderValueLabelProps<T extends ValidComponent = 'div'> = ComponentProps<
  typeof SliderPrimitive.ValueLabel<T>
>

export const SliderValueLabel = <T extends ValidComponent = 'div'>(
  props: SliderValueLabelProps<T>,
) => {
  const [, rest] = splitProps(props as SliderValueLabelProps, ['class'])

  return (
    <SliderPrimitive.ValueLabel
      data-slot="slider-value-label"
      class={cx('text-sm font-medium select-none', props.class)}
      {...rest}
    />
  )
}

export type SliderDescriptionProps<T extends ValidComponent = 'div'> = ComponentProps<
  typeof SliderPrimitive.Description<T>
>

export const SliderDescription = <T extends ValidComponent = 'div'>(
  props: SliderDescriptionProps<T>,
) => {
  const [, rest] = splitProps(props as SliderDescriptionProps, ['class'])

  return (
    <SliderPrimitive.Description
      data-slot="slider-description"
      class={cx('text-muted-foreground text-sm', props.class)}
      {...rest}
    />
  )
}

export type SliderErrorMessageProps<T extends ValidComponent = 'div'> = ComponentProps<
  typeof SliderPrimitive.ErrorMessage<T>
>

export const SliderErrorMessage = <T extends ValidComponent = 'div'>(
  props: SliderErrorMessageProps<T>,
) => {
  const [, rest] = splitProps(props as SliderErrorMessageProps, ['class'])

  return (
    <SliderPrimitive.ErrorMessage
      data-slot="slider-ErrorMessage"
      class={cx('text-destructive text-sm', props.class)}
      {...rest}
    />
  )
}
