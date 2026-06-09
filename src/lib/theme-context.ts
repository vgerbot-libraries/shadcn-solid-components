import { createContext } from 'solid-js'
import type { ComponentPropsFor, ComponentPropsMap } from './component-props-map'

export type RadiusValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

/**
 * Component names enum for theme configuration.
 * Used to identify components in the componentClass callback.
 */
export const ComponentName = {
  Accordion: 'Accordion',
  Alert: 'Alert',
  AlertDialog: 'AlertDialog',
  AppleDock: 'AppleDock',
  Avatar: 'Avatar',
  Badge: 'Badge',
  Breadcrumbs: 'Breadcrumbs',
  Button: 'Button',
  ButtonGroup: 'ButtonGroup',
  Calendar: 'Calendar',
  Card: 'Card',
  Carousel: 'Carousel',
  Chart: 'Chart',
  Checkbox: 'Checkbox',
  Collapsible: 'Collapsible',
  Combobox: 'Combobox',
  Command: 'Command',
  Countup: 'Countup',
  ColorPicker: 'ColorPicker',
  ContextMenu: 'ContextMenu',
  DatePicker: 'DatePicker',
  Dialog: 'Dialog',
  Drawer: 'Drawer',
  DropdownMenu: 'DropdownMenu',
  FileField: 'FileField',
  HoverCard: 'HoverCard',
  Icons: 'Icons',
  Item: 'Item',
  Kbd: 'Kbd',
  List: 'List',
  Markdown: 'Markdown',
  Marquee: 'Marquee',
  Menubar: 'Menubar',
  NavigationMenu: 'NavigationMenu',
  NumberField: 'NumberField',
  OtpField: 'OtpField',
  Pagination: 'Pagination',
  Popover: 'Popover',
  Progress: 'Progress',
  QrCode: 'QrCode',
  RadioGroup: 'RadioGroup',
  Resizable: 'Resizable',
  ScrollArea: 'ScrollArea',
  Search: 'Search',
  SegmentedControl: 'SegmentedControl',
  Select: 'Select',
  Separator: 'Separator',
  Sidebar: 'Sidebar',
  Skeleton: 'Skeleton',
  Spinner: 'Spinner',
  Slider: 'Slider',
  Sonner: 'Sonner',
  StatusIndicator: 'StatusIndicator',
  Switch: 'Switch',
  Table: 'Table',
  Tabs: 'Tabs',
  TextField: 'TextField',
  Textarea: 'Textarea',
  Timeline: 'Timeline',
  Theme: 'Theme',
  ToggleButton: 'ToggleButton',
  ToggleGroup: 'ToggleGroup',
  Tooltip: 'Tooltip',
  VirtualScrollArea: 'VirtualScrollArea',
  Watermark: 'Watermark',
} as const

export type ComponentName = (typeof ComponentName)[keyof typeof ComponentName]

export interface ThemeConfig {
  base: {
    radius: RadiusValue
  }
  // Component-level class configuration
  // Can be a function: (componentName: ComponentName, props: ComponentPropsFor<ComponentName>) => string | undefined
  // Or an object: Record<ComponentName, (props: ComponentPropsFor<ComponentName>) => string | undefined>
  componentClass?:
    | (<N extends ComponentName>(
        componentName: N,
        props: ComponentPropsFor<N>,
      ) => string | undefined)
    | {
        [K in ComponentName]?: (props: ComponentPropsFor<K>) => string | undefined
      }
  // Future: dark and light mode specific overrides
  dark?: {
    // theme-specific dark mode settings
  }
  light?: {
    // theme-specific light mode settings
  }
}

export interface ThemeContextValue {
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
}

export const ThemeContext = createContext<ThemeContextValue>()
