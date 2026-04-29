export interface LoginFormLocale {
  loginTitle: string
  loginDescription: string
  registerTitle: string
  registerDescription: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  confirmPasswordLabel: string
  confirmPasswordPlaceholder: string
  rememberMe: string
  forgotPassword: string
  loginButton: string
  registerButton: string
  loginFooter: string
  loginFooterLink: string
  registerFooter: string
  registerFooterLink: string
  orContinueWith: string
}

export interface TanstackTableLocale {
  noResults: string
  selectAll: string
  selectRow: string
  selectedCount: (selected: number, total: number) => string
  expandRow: string
  collapseRow: string
  search: string
  rowsPerPage: string
  pageInfo: (page: number, totalPages: number) => string
  firstPage: string
  previousPage: string
  nextPage: string
  lastPage: string
}

export interface DatePickerFieldLocale {
  placeholder: string
  rangePlaceholder: string
  multiplePlaceholder: string
  clear: string
  today: string
}

export interface OTPFieldLocale {
  label: string
  description: string
}

export interface FileUploadZoneLocale {
  dropHere: string
  browse: string
  or: string
  remove: string
  maxSize: (size: string) => string
  maxFiles: (count: number) => string
  invalidType: string
  fileTooLarge: string
}

export interface NotificationCenterLocale {
  title: string
  markAllRead: string
  empty: string
  all: string
}

export interface DataTableToolbarLocale {
  searchPlaceholder: string
  columns: string
  toggleAll: string
  resetFilters: string
}

export interface FilterBuilderLocale {
  addRule: string
  removeRule: string
  reset: string
  where: string
  and: string
  noFields: string
  selectField: string
  selectOperator: string
  enterValue: string
}

export interface DataTableLocale {
  toolbar: Partial<DataTableToolbarLocale>
  table: Partial<TanstackTableLocale>
  emptyTitle: string
  emptyDescription: string
}

export interface StepperLocale {
  next: string
  previous: string
  finish: string
  stepOf: (current: number, total: number) => string
}

export interface TagInputLocale {
  placeholder: string
  removeTag: string
  maxReached: (max: number) => string
}

export interface DescriptionListLocale {
  copied: string
  copy: string
}

export interface TimelineLocale {
  pending: string
}

export interface ConfirmDialogLocale {
  confirm: string
  cancel: string
}

export interface TransferListLocale {
  sourceTitle: string
  targetTitle: string
  searchPlaceholder: string
  moveRight: string
  moveAllRight: string
  moveLeft: string
  moveAllLeft: string
  selected: (count: number, total: number) => string
  noData: string
}

export interface CommandPaletteLocale {
  placeholder: string
  noResults: string
}

export interface UserMenuLocale {
  lightTheme: string
  darkTheme: string
  systemTheme: string
  themeLabel: string
  signOut: string
}

export interface ModeToggleDropdownLocale {
  toggleTheme: string
  light: string
  dark: string
  system: string
}

export interface SettingsLayoutLocale {
  toggleSidebar: string
}

export interface OverlayPageLocale {
  back: string
}

export interface ActivityFeedLocale {
  empty: string
  loading: string
  loadMore: string
  loadingMore: string
}

export interface PricingTableLocale {
  monthly: string
  yearly: string
  popular: string
  perMonth: string
  perYear: string
  billedYearly: (currency: string, amount: number) => string
  additionalFeatures: string
}

export interface FaqSectionLocale {
  searchPlaceholder: string
  allCategories: string
  emptyTitle: string
  emptyDescription: string
}

export interface ErrorPageLocale {
  titles: Record<'404' | '403' | '500' | '503' | 'generic', string>
  descriptions: Record<'404' | '403' | '500' | '503' | 'generic', string>
  goHome: string
}

export interface Locale {
  locale: string
  LoginForm: LoginFormLocale
  TanstackTable: TanstackTableLocale
  DatePickerField: DatePickerFieldLocale
  OTPField: OTPFieldLocale
  FileUploadZone: FileUploadZoneLocale
  NotificationCenter: NotificationCenterLocale
  DataTableToolbar: DataTableToolbarLocale
  FilterBuilder: FilterBuilderLocale
  DataTable: DataTableLocale
  Stepper: StepperLocale
  TagInput: TagInputLocale
  DescriptionList: DescriptionListLocale
  Timeline: TimelineLocale
  ConfirmDialog: ConfirmDialogLocale
  TransferList: TransferListLocale
  CommandPalette: CommandPaletteLocale
  UserMenu: UserMenuLocale
  ModeToggleDropdown: ModeToggleDropdownLocale
  SettingsLayout: SettingsLayoutLocale
  OverlayPage: OverlayPageLocale
  ActivityFeed: ActivityFeedLocale
  PricingTable: PricingTableLocale
  FaqSection: FaqSectionLocale
  ErrorPage: ErrorPageLocale
}
