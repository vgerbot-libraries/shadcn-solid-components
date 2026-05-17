import { callHandler } from 'shadcn-solid-components/lib/call-handler'
import { cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import {
  type ComponentProps,
  createContext,
  createEffect,
  createSignal,
  For,
  onCleanup,
  children as resolveChildren,
  Show,
  splitProps,
  useContext,
} from 'solid-js'

type AvatarStatus = 'idle' | 'loading' | 'loaded' | 'error'

interface AvatarContextValue {
  src: () => string | undefined
  status: () => AvatarStatus
  setStatus: (status: AvatarStatus) => void
}

const AvatarContext = createContext<AvatarContextValue>()

export interface AvatarProps extends ComponentProps<'span'> {
  src?: string
}

export const Avatar = (props: AvatarProps) => {
  const [local, rest] = splitProps(props, ['class', 'children', 'src'])
  const componentClass = useComponentClass(ComponentName.Avatar, props)
  const [status, setStatus] = createSignal<AvatarStatus>(local.src ? 'loading' : 'idle')

  createEffect(() => {
    setStatus(local.src ? 'loading' : 'idle')
  })

  return (
    <AvatarContext.Provider
      value={{
        src: () => local.src,
        status,
        setStatus,
      }}
    >
      <span
        data-slot="avatar"
        class={cx(
          'relative flex size-10 shrink-0 overflow-hidden rounded-full',
          componentClass,
          local.class,
        )}
        {...rest}
      >
        {local.children}
      </span>
    </AvatarContext.Provider>
  )
}

export interface AvatarImageProps extends Omit<ComponentProps<'img'>, 'src'> {
  src?: string
}

export const AvatarImage = (props: AvatarImageProps) => {
  const [local, rest] = splitProps(props, ['class', 'src', 'onLoad', 'onError'])
  const avatarContext = useContext(AvatarContext)
  const src = () => local.src ?? avatarContext?.src()

  return (
    <Show when={src()}>
      <img
        data-slot="avatar-image"
        src={src()}
        class={cx('aspect-square size-full object-cover', local.class)}
        onLoad={event => {
          avatarContext?.setStatus('loaded')
          callHandler(event, local.onLoad)
        }}
        onError={event => {
          avatarContext?.setStatus('error')
          callHandler(event, local.onError)
        }}
        {...rest}
      />
    </Show>
  )
}

export interface AvatarFallbackProps extends ComponentProps<'span'> {
  delayMs?: number
}

export const AvatarFallback = (props: AvatarFallbackProps) => {
  const [local, rest] = splitProps(props, ['class', 'children', 'delayMs'])
  const avatarContext = useContext(AvatarContext)
  const [canRender, setCanRender] = createSignal(local.delayMs == null || local.delayMs <= 0)

  createEffect(() => {
    if (local.delayMs == null || local.delayMs <= 0) {
      setCanRender(true)
      return
    }

    setCanRender(false)
    const timeoutId = setTimeout(() => {
      setCanRender(true)
    }, local.delayMs)

    onCleanup(() => {
      clearTimeout(timeoutId)
    })
  })

  const shouldShow = () => {
    if (!canRender()) {
      return false
    }

    if (!avatarContext) {
      return true
    }

    return avatarContext.status() !== 'loaded'
  }

  return (
    <Show when={shouldShow()}>
      <span
        data-slot="avatar-fallback"
        class={cx(
          'bg-muted flex size-full items-center justify-center rounded-full text-sm font-medium',
          local.class,
        )}
        {...rest}
      >
        {local.children}
      </span>
    </Show>
  )
}

export interface AvatarGroupProps extends ComponentProps<'div'> {
  max?: number
  total?: number
}

export const AvatarGroup = (props: AvatarGroupProps) => {
  const [local, rest] = splitProps(props, ['class', 'children', 'max', 'total'])
  const resolvedChildren = resolveChildren(() => local.children)

  const items = () => resolvedChildren.toArray().filter(Boolean)
  const visibleItems = () => {
    if (local.max == null || local.max <= 0) {
      return items()
    }

    return items().slice(0, local.max)
  }
  const overflow = () => Math.max((local.total ?? items().length) - visibleItems().length, 0)

  return (
    <div data-slot="avatar-group" class={cx('flex items-center', local.class)} {...rest}>
      <For each={visibleItems()}>
        {item => (
          <span
            data-slot="avatar-group-item"
            class="ring-background -ml-2 inline-flex rounded-full ring-2 first:ml-0"
          >
            {item}
          </span>
        )}
      </For>

      <Show when={overflow() > 0}>
        <span
          data-slot="avatar-group-overflow"
          class="bg-muted text-muted-foreground ring-background -ml-2 inline-flex size-10 items-center justify-center rounded-full text-xs font-medium ring-2"
        >
          +{overflow()}
        </span>
      </Show>
    </div>
  )
}
