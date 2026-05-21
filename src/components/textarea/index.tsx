import type { VariantProps } from 'cva'
import { callHandler } from 'shadcn-solid-components/lib/call-handler'
import { cva, cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import { type ComponentProps, createEffect, mergeProps, splitProps } from 'solid-js'

export const textareaVariants = cva({
  base: [
    'border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex w-full border bg-transparent shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    'resize-y',
  ],
  variants: {
    size: {
      sm: 'min-h-16 px-3 py-2 text-sm',
      default: 'min-h-24 px-3 py-2 text-sm',
      lg: 'min-h-32 px-4 py-3 text-base',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export type TextareaProps = ComponentProps<'textarea'> &
  VariantProps<typeof textareaVariants> & {
    autoResize?: boolean
  }

const resizeToFitContent = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

export const Textarea = (props: TextareaProps) => {
  const merge = mergeProps(
    {
      size: 'default',
      autoResize: false,
    } as TextareaProps,
    props,
  )
  const [local, rest] = splitProps(merge, ['class', 'size', 'autoResize', 'onInput'])
  const componentClass = useComponentClass(ComponentName.Textarea, merge)
  let textareaRef: HTMLTextAreaElement | undefined

  createEffect(() => {
    if (!local.autoResize || !textareaRef) {
      return
    }

    merge.value
    resizeToFitContent(textareaRef)
  })

  return (
    <textarea
      data-slot="textarea"
      class={cx(
        textareaVariants({ size: local.size }),
        local.autoResize && 'resize-none overflow-hidden',
        'rounded-component',
        componentClass,
        local.class,
      )}
      onInput={event => {
        if (local.autoResize) {
          resizeToFitContent(event.currentTarget)
        }
        callHandler(event, local.onInput)
      }}
      ref={element => {
        textareaRef = element
      }}
      {...rest}
    />
  )
}

export type TextareaFieldProps = ComponentProps<'div'>

export const TextareaField = (props: TextareaFieldProps) => {
  const [local, rest] = splitProps(props, ['class'])

  return <div data-slot="textarea-field" class={cx('grid w-full gap-2', local.class)} {...rest} />
}

export type TextareaLabelProps = ComponentProps<'label'>

export const TextareaLabel = (props: TextareaLabelProps) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <label
      data-slot="textarea-label"
      class={cx(
        'text-sm font-medium select-none',
        'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
        'data-invalid:text-destructive',
        local.class,
      )}
      {...rest}
    />
  )
}

export type TextareaDescriptionProps = ComponentProps<'p'>

export const TextareaDescription = (props: TextareaDescriptionProps) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <p
      data-slot="textarea-description"
      class={cx('text-muted-foreground text-sm', local.class)}
      {...rest}
    />
  )
}

export type TextareaCountFormatter = (count: number, maxLength?: number) => string

export type TextareaCountProps = ComponentProps<'div'> & {
  value?: string | null
  count?: number
  maxLength?: number
  formatter?: TextareaCountFormatter
}

const getTextLength = (value: string | null | undefined) => Array.from(value ?? '').length

export const TextareaCount = (props: TextareaCountProps) => {
  const [local, rest] = splitProps(props, ['class', 'value', 'count', 'maxLength', 'formatter'])

  const count = () => local.count ?? getTextLength(local.value)

  const text = () => {
    if (local.formatter) {
      return local.formatter(count(), local.maxLength)
    }

    if (local.maxLength == null) {
      return `${count()}`
    }

    return `${count()} / ${local.maxLength}`
  }

  return (
    <div
      data-slot="textarea-count"
      aria-live="polite"
      class={cx('text-muted-foreground text-right text-xs tabular-nums', local.class)}
      {...rest}
    >
      {text()}
    </div>
  )
}
