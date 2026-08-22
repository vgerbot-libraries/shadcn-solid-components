export interface AuthFormLocale {
  loginTitle: string
  loginDescription: string
  registerTitle: string
  registerDescription: string
  resetTitle: string
  resetDescription: string
  modeLogin: string
  modeRegister: string
  modeReset: string
  methodPassword: string
  methodPhoneOtp: string
  methodEmailOtp: string
  methodOauth: string
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  newPasswordLabel: string
  newPasswordPlaceholder: string
  confirmPasswordLabel: string
  confirmPasswordPlaceholder: string
  otpCodeLabel: string
  otpCodePlaceholder: string
  sendCodeButton: string
  codeSentTo: string
  changeTarget: string
  rememberMe: string
  forgotPassword: string
  loginButton: string
  registerButton: string
  resetButton: string
  loginFooter: string
  loginFooterLink: string
  registerFooter: string
  registerFooterLink: string
  backToLogin: string
  orContinueWith: string
  emailRequired: string
  phoneRequired: string
  invalidEmail: string
  passwordRequired: string
  passwordTooShort: string
  confirmPasswordMismatch: string
  otpCodeRequired: string
  otpVerifyFailed: string
  operationFailed: string
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

export interface DatePickerLocale {
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

export interface DataListLocale {
  searchPlaceholder: string
  emptyText: string
  reload: string
  reset: string
  expand: string
  collapse: string
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

export interface DialogServiceLocale {
  confirm: string
  cancel: string
  close: string
  promptRequired: string
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

export interface InvoiceLocale {
  title: string
  from: string
  to: string
  invoiceNumber: string
  orderId: string
  issueDate: string
  dueDate: string
  accountId: string
  status: string
  paymentStatus: string
  paymentMethod: string
  paymentReference: string
  paidAt: string
  quantity: string
  item: string
  sku: string
  description: string
  amount: string
  paymentDetails: string
  notes: string
  terms: string
  subTotal: string
  tax: string
  shipping: string
  discount: string
  total: string
  amountPaid: string
  amountDue: string
  print: string
  noItems: string
  statuses: Record<'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled', string>
  paymentStatuses: Record<'unpaid' | 'partial' | 'paid' | 'refunded', string>
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

export interface CascadeLocale {
  selectName: string
}

export interface SchemaFormLocale {
  submit: string
  addItem: string
  removeItem: string
  arrayItem: string
  booleanLabel: string
  selectPlaceholder: string
  loadingOptions: string
  fieldRequired: string
  constInvalid: string
  enumInvalid: string
  invalidString: string
  invalidNumber: string
  invalidInteger: string
  invalidBoolean: string
  invalidArray: string
  invalidObject: string
  minLength: (min: number) => string
  maxLength: (max: number) => string
  patternMismatch: string
  minimum: (min: number) => string
  maximum: (max: number) => string
  exclusiveMinimum: (min: number) => string
  exclusiveMaximum: (max: number) => string
  multipleOf: (unit: number) => string
  minItems: (min: number) => string
  maxItems: (max: number) => string
}

export interface Locale {
  locale: string
  AuthForm: AuthFormLocale
  TanstackTable: TanstackTableLocale
  DatePicker: DatePickerLocale
  OTPField: OTPFieldLocale
  FileUploadZone: FileUploadZoneLocale
  NotificationCenter: NotificationCenterLocale
  DataTableToolbar: DataTableToolbarLocale
  FilterBuilder: FilterBuilderLocale
  DataTable: DataTableLocale
  DataList: DataListLocale
  Stepper: StepperLocale
  TagInput: TagInputLocale
  DescriptionList: DescriptionListLocale
  Timeline: TimelineLocale
  ConfirmDialog: ConfirmDialogLocale
  DialogService: DialogServiceLocale
  TransferList: TransferListLocale
  CommandPalette: CommandPaletteLocale
  UserMenu: UserMenuLocale
  ModeToggleDropdown: ModeToggleDropdownLocale
  SettingsLayout: SettingsLayoutLocale
  OverlayPage: OverlayPageLocale
  ActivityFeed: ActivityFeedLocale
  PricingTable: PricingTableLocale
  Invoice: InvoiceLocale
  FaqSection: FaqSectionLocale
  ErrorPage: ErrorPageLocale
  SchemaForm: SchemaFormLocale
  Cascade: CascadeLocale
}
