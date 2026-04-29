import type { ElementOf } from '@kobalte/core'
import { Polymorphic } from '@kobalte/core'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import type { VariantProps } from 'cva'
import { callHandler } from 'shadcn-solid-components/lib/call-handler'
import { combineStyle } from 'shadcn-solid-components/lib/combine-style'
import { cva, cx } from 'shadcn-solid-components/lib/cva'
import { useIsMobile } from 'shadcn-solid-components/lib/use-mobile'
import type { Accessor, ComponentProps, JSX, Setter, ValidComponent } from 'solid-js'
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  Match,
  mergeProps,
  onCleanup,
  Show,
  splitProps,
  Switch,
  useContext,
} from 'solid-js'

import { Button, type ButtonProps } from '../button'
import { Drawer, DrawerContent } from '../drawer'
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '../tooltip'

const DUAL_SIDEBAR_RAIL_WIDTH = '3rem'
const DUAL_SIDEBAR_PANEL_WIDTH = '14rem'
const DUAL_SIDEBAR_PANEL_MOBILE_WIDTH = '18rem'
const DUAL_SIDEBAR_KEYBOARD_SHORTCUT = 'b'

/* -------------------------------------------------------------------------- */
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */

export interface DualSidebarContextValue {
  state: Accessor<'expanded' | 'collapsed'>
  open: Accessor<boolean>
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void
  openMobile: Accessor<boolean>
  setOpenMobile: Setter<boolean>
  isMobile: Accessor<boolean>
  togglePanel: () => void
  activeKey: Accessor<string | undefined>
  setActiveKey: (key: string, options?: { openOnSelect?: boolean }) => void
}

const DualSidebarContext = createContext<DualSidebarContextValue | null>(null)

export const useDualSidebar = (): DualSidebarContextValue => {
  const ctx = useContext(DualSidebarContext)
  if (!ctx) {
    throw new Error('useDualSidebar must be used within a DualSidebarProvider.')
  }
  return ctx
}

/* -------------------------------------------------------------------------- */
/*  Provider                                                                  */
/* -------------------------------------------------------------------------- */

export type DualSidebarProviderProps = ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  activeKey?: string
  defaultActiveKey?: string
  onActiveKeyChange?: (key: string) => void
}

export const DualSidebarProvider = (props: DualSidebarProviderProps) => {
  const merge = mergeProps<DualSidebarProviderProps[]>(
    {
      defaultOpen: true,
    },
    props,
  )
  const [, rest] = splitProps(merge, [
    'defaultOpen',
    'open',
    'onOpenChange',
    'activeKey',
    'defaultActiveKey',
    'onActiveKeyChange',
    'class',
    'style',
    'children',
  ])

  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = createSignal(false)

  const [_open, _setOpen] = createSignal(merge.defaultOpen!)
  const open = createMemo(() => merge.open ?? _open())
  const setOpen: DualSidebarContextValue['setOpen'] = value => {
    const next = typeof value === 'function' ? value(open()) : value
    if (merge.onOpenChange) {
      merge.onOpenChange(next)
    } else {
      _setOpen(next)
    }
  }

  const [_activeKey, _setActiveKey] = createSignal<string | undefined>(merge.defaultActiveKey)
  const activeKey = createMemo(() => merge.activeKey ?? _activeKey())
  const setActiveKey: DualSidebarContextValue['setActiveKey'] = (key, options) => {
    if (merge.activeKey === undefined) {
      _setActiveKey(key)
    }
    merge.onActiveKeyChange?.(key)
    if (options?.openOnSelect !== false) {
      if (isMobile()) {
        setOpenMobile(true)
      } else {
        setOpen(true)
      }
    }
  }

  const togglePanel = () => {
    if (isMobile()) {
      setOpenMobile(prev => !prev)
    } else {
      setOpen(prev => !prev)
    }
  }

  createEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === DUAL_SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        togglePanel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown))
  })

  const state = createMemo(() => (open() ? 'expanded' : 'collapsed'))

  const value: DualSidebarContextValue = {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    togglePanel,
    activeKey,
    setActiveKey,
  }

  return (
    <DualSidebarContext.Provider value={value}>
      <div
        data-slot="dual-sidebar-provider"
        style={combineStyle(
          {
            '--dual-sidebar-rail-width': DUAL_SIDEBAR_RAIL_WIDTH,
            '--dual-sidebar-panel-width': DUAL_SIDEBAR_PANEL_WIDTH,
            '--dual-sidebar-panel-mobile-width': DUAL_SIDEBAR_PANEL_MOBILE_WIDTH,
          },
          merge.style,
        )}
        class={cx('flex min-h-svh w-full text-foreground', merge.class)}
        {...rest}
      >
        {merge.children}
      </div>
    </DualSidebarContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*  Top-level layout container                                                */
/* -------------------------------------------------------------------------- */

export type DualSidebarProps = ComponentProps<'div'>

export const DualSidebar = (props: DualSidebarProps) => {
  const [, rest] = splitProps(props, ['class'])
  return <div data-slot="dual-sidebar" class={cx('flex min-h-svh w-full', props.class)} {...rest} />
}

/* -------------------------------------------------------------------------- */
/*  Rail                                                                      */
/* -------------------------------------------------------------------------- */

export type DualSidebarRailProps = ComponentProps<'div'>

export const DualSidebarRail = (props: DualSidebarRailProps) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <div
      data-slot="dual-sidebar-rail"
      class={cx(
        'flex h-svh w-(--dual-sidebar-rail-width) shrink-0 flex-col items-center gap-1 border-r bg-background py-2',
        props.class,
      )}
      {...rest}
    />
  )
}

export type DualSidebarRailHeaderProps = ComponentProps<'div'>

export const DualSidebarRailHeader = (props: DualSidebarRailHeaderProps) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <div
      data-slot="dual-sidebar-rail-header"
      class={cx('flex w-full flex-col items-center gap-1 px-1 pb-1', props.class)}
      {...rest}
    />
  )
}

export type DualSidebarRailContentProps = ComponentProps<'div'>

export const DualSidebarRailContent = (props: DualSidebarRailContentProps) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <div
      data-slot="dual-sidebar-rail-content"
      class={cx(
        'flex w-full min-h-0 flex-1 flex-col items-center gap-1 overflow-y-auto px-1',
        props.class,
      )}
      {...rest}
    />
  )
}

export type DualSidebarRailFooterProps = ComponentProps<'div'>

export const DualSidebarRailFooter = (props: DualSidebarRailFooterProps) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <div
      data-slot="dual-sidebar-rail-footer"
      class={cx('mt-auto flex w-full flex-col items-center gap-1 px-1 pt-1', props.class)}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  Rail item                                                                 */
/* -------------------------------------------------------------------------- */

export const dualSidebarRailItemVariants = cva({
  base: [
    'inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:ring-2 focus-visible:ring-ring/50',
    'data-[active=true]:bg-accent data-[active=true]:text-accent-foreground',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&>svg]:size-4 [&>svg]:shrink-0',
  ],
  variants: {
    size: {
      default: 'size-9',
      sm: 'size-8',
      lg: 'size-10',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export interface DualSidebarRailItemOptions
  extends VariantProps<typeof dualSidebarRailItemVariants> {
  sectionKey?: string
  isActive?: boolean
  tooltip?: string | ComponentProps<typeof TooltipContent>
  openOnSelect?: boolean
  onSelect?: (key: string) => void
}

export interface DualSidebarRailItemCommonProps<_T extends HTMLElement = HTMLElement> {
  class?: string
  onClick?: JSX.EventHandlerUnion<_T, MouseEvent>
}

export type DualSidebarRailItemProps<T extends ValidComponent = 'button'> =
  DualSidebarRailItemOptions & Partial<DualSidebarRailItemCommonProps<ElementOf<T>>>

export const DualSidebarRailItem = <T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, DualSidebarRailItemProps<T>>,
) => {
  const merge = mergeProps(
    {
      as: 'button',
    } as PolymorphicProps<T, DualSidebarRailItemProps<T>>,
    props,
  )
  const [, rest] = splitProps(merge, [
    'as',
    'class',
    'sectionKey',
    'isActive',
    'tooltip',
    'openOnSelect',
    'onSelect',
    'onClick',
    'size',
  ])

  const ctx = useDualSidebar()

  const isActive = createMemo(() => {
    if (merge.isActive !== undefined) return merge.isActive
    if (merge.sectionKey !== undefined) return ctx.activeKey() === merge.sectionKey
    return false
  })

  const handleClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = event => {
    callHandler(event, merge.onClick as JSX.EventHandlerUnion<HTMLElement, MouseEvent>)
    if (event.defaultPrevented) return
    if (merge.sectionKey !== undefined) {
      ctx.setActiveKey(merge.sectionKey, { openOnSelect: merge.openOnSelect !== false })
      const onSelect = merge.onSelect as ((key: string) => void) | undefined
      onSelect?.(merge.sectionKey)
    }
  }

  const buttonClass = dualSidebarRailItemVariants({
    size: merge.size,
    class: merge.class,
  })

  return (
    <Show
      when={merge.tooltip}
      fallback={
        <Polymorphic
          as={merge.as}
          data-slot="dual-sidebar-rail-item"
          data-active={isActive()}
          class={buttonClass}
          onClick={handleClick}
          {...rest}
        />
      }
    >
      <Tooltip placement="right">
        <TooltipTrigger
          as={merge.as as ValidComponent}
          data-slot="dual-sidebar-rail-item"
          data-active={isActive()}
          class={buttonClass}
          onClick={handleClick}
          {...rest}
        />
        <TooltipPortal>
          <TooltipContent
            {...(typeof merge.tooltip === 'string' ? { children: merge.tooltip } : merge.tooltip)}
          />
        </TooltipPortal>
      </Tooltip>
    </Show>
  )
}

/* -------------------------------------------------------------------------- */
/*  Panel                                                                     */
/* -------------------------------------------------------------------------- */

export type DualSidebarPanelProps = ComponentProps<'div'>

export const DualSidebarPanel = (props: DualSidebarPanelProps) => {
  const [, rest] = splitProps(props, ['class', 'children'])
  const ctx = useDualSidebar()

  return (
    <Switch
      fallback={
        <div
          data-slot="dual-sidebar-panel"
          data-state={ctx.state()}
          class={cx(
            'relative hidden h-svh shrink-0 overflow-hidden border-r bg-background transition-[width] duration-200 ease-linear md:block',
            'w-(--dual-sidebar-panel-width) data-[state=collapsed]:w-0 data-[state=collapsed]:border-r-0',
            props.class,
          )}
          {...rest}
        >
          <div
            data-slot="dual-sidebar-panel-inner"
            class="flex h-full w-(--dual-sidebar-panel-width) flex-col"
          >
            {props.children}
          </div>
        </div>
      }
    >
      <Match when={ctx.isMobile()}>
        <Drawer open={ctx.openMobile()} onOpenChange={ctx.setOpenMobile} side="left">
          <DrawerContent
            data-slot="dual-sidebar-panel"
            data-mobile="true"
            class="w-(--dual-sidebar-panel-mobile-width) bg-background p-0 sm:max-w-(--dual-sidebar-panel-mobile-width) [&>button]:hidden"
          >
            <div class="flex h-full w-full flex-col">{props.children}</div>
          </DrawerContent>
        </Drawer>
      </Match>
    </Switch>
  )
}

export type DualSidebarPanelHeaderProps = ComponentProps<'div'>

export const DualSidebarPanelHeader = (props: DualSidebarPanelHeaderProps) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <div
      data-slot="dual-sidebar-panel-header"
      class={cx('flex shrink-0 flex-col gap-1 px-3 pt-4 pb-2', props.class)}
      {...rest}
    />
  )
}

export type DualSidebarPanelContentProps = ComponentProps<'div'>

export const DualSidebarPanelContent = (props: DualSidebarPanelContentProps) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <div
      data-slot="dual-sidebar-panel-content"
      class={cx('flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 py-2', props.class)}
      {...rest}
    />
  )
}

export type DualSidebarPanelFooterProps = ComponentProps<'div'>

export const DualSidebarPanelFooter = (props: DualSidebarPanelFooterProps) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <div
      data-slot="dual-sidebar-panel-footer"
      class={cx('mt-auto flex shrink-0 flex-col gap-1 border-t px-2 py-2', props.class)}
      {...rest}
    />
  )
}

export type DualSidebarPanelTitleProps = ComponentProps<'p'>

export const DualSidebarPanelTitle = (props: DualSidebarPanelTitleProps) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <p
      data-slot="dual-sidebar-panel-title"
      class={cx(
        'px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground',
        props.class,
      )}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export type DualSidebarSectionProps = {
  sectionKey: string
  forceMount?: boolean
  children: JSX.Element
  class?: string
}

export const DualSidebarSection = (props: DualSidebarSectionProps) => {
  const ctx = useDualSidebar()
  const isActive = createMemo(() => ctx.activeKey() === props.sectionKey)

  return (
    <Show when={props.forceMount || isActive()}>
      <div
        data-slot="dual-sidebar-section"
        data-active={isActive()}
        hidden={!isActive() && props.forceMount ? true : undefined}
        class={cx('flex h-full min-h-0 flex-1 flex-col', props.class)}
      >
        {props.children}
      </div>
    </Show>
  )
}

/* -------------------------------------------------------------------------- */
/*  Trigger                                                                   */
/* -------------------------------------------------------------------------- */

export type DualSidebarTriggerProps<T extends ValidComponent = 'button'> = ComponentProps<
  typeof Button<T>
>

export const DualSidebarTrigger = <T extends ValidComponent = 'button'>(
  props: DualSidebarTriggerProps<T>,
) => {
  const [, rest] = splitProps(props as DualSidebarTriggerProps, ['class', 'onClick', 'children'])
  const ctx = useDualSidebar()

  const handleClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = event => {
    callHandler(event, (props as DualSidebarTriggerProps).onClick)
    if (event.defaultPrevented) return
    ctx.togglePanel()
  }

  return (
    <Button
      data-slot="dual-sidebar-trigger"
      aria-label="Toggle Sidebar"
      title="Toggle Sidebar"
      variant="ghost"
      size="icon"
      class={cx('size-7', (props as DualSidebarTriggerProps).class)}
      onClick={handleClick}
      {...(rest as ButtonProps)}
    >
      <Show
        when={(props as DualSidebarTriggerProps).children}
        fallback={
          <Show
            when={!ctx.open()}
            fallback={
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 3v18m7-6l-3-3l3-3" />
                </g>
              </svg>
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18m5-12l3 3l-3 3" />
              </g>
            </svg>
          </Show>
        }
      >
        {(props as DualSidebarTriggerProps).children}
      </Show>
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Inset                                                                     */
/* -------------------------------------------------------------------------- */

export type DualSidebarInsetProps = ComponentProps<'main'>

export const DualSidebarInset = (props: DualSidebarInsetProps) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <main
      data-slot="dual-sidebar-inset"
      class={cx('relative flex min-w-0 flex-1 flex-col bg-background', props.class)}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  Menu primitives (so consumers don't need components/sidebar)              */
/* -------------------------------------------------------------------------- */

export type DualSidebarMenuProps = ComponentProps<'ul'>

export const DualSidebarMenu = (props: DualSidebarMenuProps) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <ul
      data-slot="dual-sidebar-menu"
      class={cx('flex w-full min-w-0 flex-col gap-1', props.class)}
      {...rest}
    />
  )
}

export type DualSidebarMenuItemProps = ComponentProps<'li'>

export const DualSidebarMenuItem = (props: DualSidebarMenuItemProps) => {
  const [, rest] = splitProps(props, ['class'])
  return <li data-slot="dual-sidebar-menu-item" class={cx('relative', props.class)} {...rest} />
}

export const dualSidebarMenuButtonVariants = cva({
  base: [
    'flex w-full items-center gap-2 overflow-hidden rounded-md px-2 text-left text-sm outline-none transition-colors',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:ring-2 focus-visible:ring-ring/50',
    'data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-accent-foreground',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&>svg]:size-4 [&>svg]:shrink-0',
    '[&>span:last-child]:truncate',
  ],
  variants: {
    size: {
      default: 'h-8',
      sm: 'h-7 text-xs',
      lg: 'h-10',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export interface DualSidebarMenuButtonOptions
  extends VariantProps<typeof dualSidebarMenuButtonVariants> {
  isActive?: boolean
}

export interface DualSidebarMenuButtonCommonProps<_T extends HTMLElement = HTMLElement> {
  class?: string
}

export type DualSidebarMenuButtonProps<T extends ValidComponent = 'button'> =
  DualSidebarMenuButtonOptions & Partial<DualSidebarMenuButtonCommonProps<ElementOf<T>>>

export const DualSidebarMenuButton = <T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, DualSidebarMenuButtonProps<T>>,
) => {
  const merge = mergeProps(
    {
      as: 'button',
      isActive: false,
    } as PolymorphicProps<T, DualSidebarMenuButtonProps<T>>,
    props,
  )
  const [, rest] = splitProps(merge, ['as', 'class', 'isActive', 'size'])

  return (
    <Polymorphic
      as={merge.as}
      data-slot="dual-sidebar-menu-button"
      data-active={merge.isActive}
      class={dualSidebarMenuButtonVariants({
        size: merge.size,
        class: merge.class,
      })}
      {...rest}
    />
  )
}
