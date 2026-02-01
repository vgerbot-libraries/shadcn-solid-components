import type { ComponentProps, ValidComponent } from 'solid-js'
import { Toaster as Sonner } from 'somoto'

import type { AccordionProps } from '../components/accordion'
import type { AlertProps } from '../components/alert'
import type { AlertDialogProps } from '../components/alert-dialog'
import type { BadgeProps } from '../components/badge'
import type { BreadcrumbsProps } from '../components/breadcrumbs'
import type { ButtonProps } from '../components/button'
import type { ButtonGroupProps } from '../components/button-group'
import type { CalendarProps } from '../components/calendar'
import type { CardProps } from '../components/card'
import type { CarouselProps } from '../components/carousel'
import type { ChartContainerProps } from '../components/chart'
import type { CheckboxProps } from '../components/checkbox'
import type { CollapsibleProps } from '../components/collapsible'
import type { ComboboxProps } from '../components/combobox'
import type { CommandProps } from '../components/command'
import type { ContextMenuProps } from '../components/context-menu'
import type { DialogProps } from '../components/dialog'
import type { DrawerProps } from '../components/drawer'
import type { DropdownMenuProps } from '../components/dropdown-menu'
import type { FileFieldProps } from '../components/file-field'
import type { HoverCardProps } from '../components/hover-card'
import type { KbdProps } from '../components/kbd'
import type { MenubarProps } from '../components/menubar'
import type { NavigationMenuProps } from '../components/navigation-menu'
import type { NumberFieldProps } from '../components/number-field'
import type { OTPFieldProps } from '../components/otp-field'
import type { PaginationProps } from '../components/pagination'
import type { PopoverProps } from '../components/popover'
import type { ProgressProps } from '../components/progress'
import type { RadioGroupProps } from '../components/radio-group'
import type { ResizableProps } from '../components/resizable'
import type { SearchProps } from '../components/search'
import type { SegmentedControlProps } from '../components/segmented-control'
import type { SelectProps } from '../components/select'
import type { SeparatorProps } from '../components/separator'
import type { SidebarProps } from '../components/sidebar'
import type { SkeletonProps } from '../components/skeleton'
import type { SliderProps } from '../components/slider'
import type { SwitchProps } from '../components/switch'
import type { TableProps } from '../components/table'
import type { TabsProps } from '../components/tabs'
import type { TextFieldProps } from '../components/text-field'
import type { ToggleButtonProps } from '../components/toggle-button'
import type { ToggleGroupProps } from '../components/toggle-group'
import type { TooltipProps } from '../components/tooltip'
import type { ComponentName } from './theme-context'

/**
 * Component Props type mapping
 * Maps ComponentName to corresponding Props type
 */
export interface ComponentPropsMap {
  [ComponentName.Accordion]: AccordionProps
  [ComponentName.Alert]: AlertProps
  [ComponentName.AlertDialog]: AlertDialogProps
  [ComponentName.Badge]: BadgeProps
  [ComponentName.Breadcrumbs]: BreadcrumbsProps
  [ComponentName.Button]: ButtonProps
  [ComponentName.ButtonGroup]: ButtonGroupProps
  [ComponentName.Calendar]: CalendarProps
  [ComponentName.Card]: CardProps
  [ComponentName.Carousel]: CarouselProps
  [ComponentName.Chart]: ChartContainerProps<any>
  [ComponentName.Checkbox]: CheckboxProps
  [ComponentName.Collapsible]: CollapsibleProps
  [ComponentName.Combobox]: ComboboxProps<any>
  [ComponentName.Command]: CommandProps
  [ComponentName.ContextMenu]: ContextMenuProps
  [ComponentName.DatePicker]: ComponentProps<'div'>
  [ComponentName.Dialog]: DialogProps
  [ComponentName.Drawer]: DrawerProps
  [ComponentName.DropdownMenu]: DropdownMenuProps
  [ComponentName.FileField]: FileFieldProps
  [ComponentName.HoverCard]: HoverCardProps
  [ComponentName.Icons]: ComponentProps<'svg'>
  [ComponentName.Kbd]: KbdProps
  [ComponentName.Menubar]: MenubarProps
  [ComponentName.NavigationMenu]: NavigationMenuProps
  [ComponentName.NumberField]: NumberFieldProps
  [ComponentName.OtpField]: OTPFieldProps
  [ComponentName.Pagination]: PaginationProps
  [ComponentName.Popover]: PopoverProps
  [ComponentName.Progress]: ProgressProps
  [ComponentName.RadioGroup]: RadioGroupProps
  [ComponentName.Resizable]: ResizableProps
  [ComponentName.Search]: SearchProps<any>
  [ComponentName.SegmentedControl]: SegmentedControlProps
  [ComponentName.Select]: SelectProps<any>
  [ComponentName.Separator]: SeparatorProps
  [ComponentName.Sidebar]: SidebarProps
  [ComponentName.Skeleton]: SkeletonProps
  [ComponentName.Slider]: SliderProps
  [ComponentName.Sonner]: Parameters<typeof Sonner>[0]
  [ComponentName.Switch]: SwitchProps
  [ComponentName.Table]: TableProps
  [ComponentName.Tabs]: TabsProps
  [ComponentName.TextField]: TextFieldProps
  [ComponentName.Theme]: ComponentProps<'div'>
  [ComponentName.ToggleButton]: ToggleButtonProps
  [ComponentName.ToggleGroup]: ToggleGroupProps
  [ComponentName.Tooltip]: TooltipProps
}

/**
 * Get the corresponding Props type based on ComponentName
 */
export type ComponentPropsFor<N extends ComponentName> = ComponentPropsMap[N]
