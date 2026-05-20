import { Button } from 'shadcn-solid-components/components/button'
import {
  Checkbox,
  CheckboxControl,
  CheckboxInput,
} from 'shadcn-solid-components/components/checkbox'
import { useLocale } from 'shadcn-solid-components/components/config-provider'
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemIndicator,
  RadioGroupItemInput,
  RadioGroupItemLabel,
} from 'shadcn-solid-components/components/radio-group'
import {
  Switch,
  SwitchControl,
  SwitchInput,
  SwitchThumb,
} from 'shadcn-solid-components/components/switch'
import {
  TextField,
  TextFieldInput,
  TextFieldTextArea,
} from 'shadcn-solid-components/components/text-field'
import { FormField } from 'shadcn-solid-components/hoc/form-field'
import type { SchemaFormLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import {
  type ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  Show,
  splitProps,
} from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export type SchemaFormPrimitiveType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'

export type SchemaFormScalar = string | number | boolean | null

export type SchemaFormValue = SchemaFormScalar | SchemaFormObject | SchemaFormValue[]

export interface SchemaFormObject {
  [key: string]: SchemaFormValue | undefined
}

export interface SchemaFormOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export interface SchemaFormDynamicRuleObject {
  field?: string
  equals?: unknown
  notEquals?: unknown
  in?: unknown[]
  notIn?: unknown[]
  exists?: boolean
  truthy?: boolean
  all?: SchemaFormDynamicRule[]
  any?: SchemaFormDynamicRule[]
  not?: SchemaFormDynamicRule
}

export interface SchemaFormDynamicRuleContext {
  path: string
  values: SchemaFormObject
  schema: SchemaFormFieldSchema
}

export type SchemaFormDynamicRule =
  | boolean
  | SchemaFormDynamicRuleObject
  | ((context: SchemaFormDynamicRuleContext) => boolean)

export interface SchemaFormFieldSchema {
  $id?: string
  $schema?: string
  title?: string
  description?: string
  type?: SchemaFormPrimitiveType
  format?: string
  default?: unknown
  enum?: unknown[]
  const?: unknown
  minLength?: number
  maxLength?: number
  pattern?: string
  minimum?: number
  maximum?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number
  multipleOf?: number
  properties?: Record<string, SchemaFormFieldSchema>
  required?: string[]
  items?: SchemaFormFieldSchema
  minItems?: number
  maxItems?: number
  ['x-ui:widget']?: string
  ['x-ui:order']?: string[]
  ['x-ui:placeholder']?: string
  ['x-ui:help']?: string
  ['x-ui:options']?: SchemaFormOption[]
  ['x-ui:optionsSource']?: string
  ['x-ui:dependsOn']?: string[]
  ['x-ui:visibleWhen']?: SchemaFormDynamicRule
  ['x-ui:disabledWhen']?: SchemaFormDynamicRule
  ['x-ui:readonlyWhen']?: SchemaFormDynamicRule
  ['x-ui:requiredWhen']?: SchemaFormDynamicRule
  [key: `x-ui:${string}`]: unknown
}

export interface SchemaFormSchema extends SchemaFormFieldSchema {
  type?: 'object'
  properties?: Record<string, SchemaFormFieldSchema>
}

export interface SchemaFormUiFieldConfig {
  widget?: string
  placeholder?: string
  help?: string
  options?: SchemaFormOption[]
  optionsSource?: string
  dependsOn?: string[]
  visibleWhen?: SchemaFormDynamicRule
  disabledWhen?: SchemaFormDynamicRule
  readonlyWhen?: SchemaFormDynamicRule
  requiredWhen?: SchemaFormDynamicRule
}

export type SchemaFormUiSchema = Record<string, SchemaFormUiFieldConfig>

export interface SchemaFormOptionLoaderContext {
  path: string
  schema: SchemaFormFieldSchema
  values: SchemaFormObject
}

export type SchemaFormOptionLoader = (
  context: SchemaFormOptionLoaderContext,
) => SchemaFormOption[] | Promise<SchemaFormOption[]>

export interface SchemaFormZodIssue {
  path?: Array<string | number>
  message: string
}

export interface SchemaFormZodErrorLike {
  issues?: SchemaFormZodIssue[]
}

export interface SchemaFormZodSafeParseResult {
  success: boolean
  error?: SchemaFormZodErrorLike
}

export interface SchemaFormZodSchemaLike {
  safeParse?: (value: unknown) => SchemaFormZodSafeParseResult
  parse?: (value: unknown) => unknown
}

export interface SchemaFormValidationResult {
  valid: boolean
  errors?: Record<string, string | string[]>
}

export interface SchemaFormWidgetProps {
  path: string
  schema: SchemaFormFieldSchema
  value: unknown
  values: SchemaFormObject
  required: boolean
  disabled: boolean
  readonly: boolean
  errors: string[]
  options: SchemaFormOption[]
  locale: SchemaFormLocale
  setValue: (value: unknown) => void
}

export type SchemaFormWidgetRenderer = (props: SchemaFormWidgetProps) => JSX.Element

export interface SchemaFormProps extends Omit<ComponentProps<'form'>, 'onChange' | 'onSubmit'> {
  schema: SchemaFormSchema
  uiSchema?: SchemaFormUiSchema
  value?: SchemaFormObject
  defaultValue?: SchemaFormObject
  onChange?: (values: SchemaFormObject) => void
  onSubmit?: (values: SchemaFormObject) => void | Promise<void>
  onValidate?: (
    values: SchemaFormObject,
  ) => SchemaFormValidationResult | Promise<SchemaFormValidationResult>
  zodSchema?: SchemaFormZodSchemaLike
  optionLoaders?: Record<string, SchemaFormOptionLoader>
  widgetRegistry?: Record<string, SchemaFormWidgetRenderer>
  validateOn?: 'submit' | 'change'
  showSubmitButton?: boolean
  submitText?: string
  locale?: Partial<SchemaFormLocale>
}

// ============================================================================
// Helpers
// ============================================================================

const PATH_PATTERN = /[^.[\]]+/g

function humanizeKey(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, first => first.toUpperCase())
}

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function toPathSegments(path: string): Array<string | number> {
  if (!path) return []
  const segments = path.match(PATH_PATTERN) ?? []
  return segments.map(segment => (/^\d+$/.test(segment) ? Number(segment) : segment))
}

function toErrorPath(path: Array<string | number>): string {
  return path
    .map((segment, index) => {
      if (typeof segment === 'number') return `[${segment}]`
      if (index === 0) return segment
      return `.${segment}`
    })
    .join('')
}

function getAtPath(source: unknown, path: string): unknown {
  if (!path) return source
  const segments = toPathSegments(path)
  let cursor: unknown = source

  for (const segment of segments) {
    if (cursor === null || cursor === undefined) return undefined
    if (Array.isArray(cursor) && typeof segment === 'number') {
      cursor = cursor[segment]
      continue
    }
    if (isObjectLike(cursor) && typeof segment === 'string') {
      cursor = cursor[segment]
      continue
    }
    return undefined
  }

  return cursor
}

function setAtPath(source: SchemaFormObject, path: string, nextValue: unknown): SchemaFormObject {
  const segments = toPathSegments(path)
  if (segments.length === 0) {
    return (isObjectLike(nextValue) ? (nextValue as SchemaFormObject) : {}) as SchemaFormObject
  }

  const root = Array.isArray(source) ? [...source] : { ...(source || {}) }
  let cursor: any = root
  let original: any = source

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index]
    const originalValue = original?.[segment as keyof typeof original]
    const nextNode = Array.isArray(originalValue)
      ? [...originalValue]
      : isObjectLike(originalValue)
        ? { ...originalValue }
        : typeof segments[index + 1] === 'number'
          ? []
          : {}

    cursor[segment as keyof typeof cursor] = nextNode
    cursor = nextNode
    original = originalValue
  }

  const last = segments[segments.length - 1]
  if (nextValue === undefined) {
    if (Array.isArray(cursor) && typeof last === 'number') {
      cursor.splice(last, 1)
    } else {
      delete cursor[last as keyof typeof cursor]
    }
  } else {
    cursor[last as keyof typeof cursor] = nextValue
  }

  return root as SchemaFormObject
}

function appendToArrayPath(
  source: SchemaFormObject,
  path: string,
  item: unknown,
): SchemaFormObject {
  const current = getAtPath(source, path)
  const items = Array.isArray(current) ? [...current] : []
  items.push(item)
  return setAtPath(source, path, items)
}

function removeArrayPathIndex(
  source: SchemaFormObject,
  path: string,
  index: number,
): SchemaFormObject {
  const current = getAtPath(source, path)
  const items = Array.isArray(current) ? [...current] : []
  items.splice(index, 1)
  return setAtPath(source, path, items)
}

function cloneValue<T>(value: T): T {
  if (value === undefined) return value
  return JSON.parse(JSON.stringify(value)) as T
}

function buildDefaultValue(schema: SchemaFormFieldSchema | undefined): unknown {
  if (!schema) return undefined
  if (schema.default !== undefined) return cloneValue(schema.default)
  if (schema.const !== undefined) return cloneValue(schema.const)

  if (schema.type === 'object') {
    const objectValue: SchemaFormObject = {}
    for (const [key, propertySchema] of Object.entries(schema.properties ?? {})) {
      const nested = buildDefaultValue(propertySchema)
      if (nested !== undefined) {
        objectValue[key] = nested as SchemaFormValue
      }
    }
    return objectValue
  }

  if (schema.type === 'array') {
    return []
  }

  return undefined
}

function toErrorRecord(errors: Record<string, string | string[]>) {
  const output: Record<string, string[]> = {}
  for (const [path, message] of Object.entries(errors)) {
    output[path] = Array.isArray(message) ? message.filter(Boolean) : [message].filter(Boolean)
  }
  return output
}

function appendError(map: Record<string, string[]>, path: string, message: string) {
  if (!message) return
  const current = map[path] ?? []
  if (!current.includes(message)) {
    map[path] = [...current, message]
  }
}

function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.length === 0
  if (Array.isArray(value)) return value.length === 0
  return false
}

function evaluateRule(
  rule: SchemaFormDynamicRule | undefined,
  fallback: boolean,
  context: SchemaFormDynamicRuleContext,
): boolean {
  if (rule === undefined) return fallback
  if (typeof rule === 'boolean') return rule
  if (typeof rule === 'function') return !!rule(context)

  if (rule.not !== undefined) {
    return !evaluateRule(rule.not, false, context)
  }

  if (Array.isArray(rule.all) && rule.all.length > 0) {
    return rule.all.every(item => evaluateRule(item, false, context))
  }

  if (Array.isArray(rule.any) && rule.any.length > 0) {
    return rule.any.some(item => evaluateRule(item, false, context))
  }

  if (!rule.field) {
    return fallback
  }

  const fieldValue = getAtPath(context.values, rule.field)

  if (rule.equals !== undefined && fieldValue !== rule.equals) return false
  if (rule.notEquals !== undefined && fieldValue === rule.notEquals) return false
  if (rule.in && !rule.in.includes(fieldValue)) return false
  if (rule.notIn && rule.notIn.includes(fieldValue)) return false

  if (rule.exists !== undefined) {
    const exists = fieldValue !== undefined && fieldValue !== null && fieldValue !== ''
    if (exists !== rule.exists) return false
  }

  if (rule.truthy !== undefined && Boolean(fieldValue) !== rule.truthy) return false

  return true
}

function normalizeOptions(value: unknown): SchemaFormOption[] {
  if (!Array.isArray(value)) return []

  return value
    .map(option => {
      if (!isObjectLike(option)) return null
      if (typeof option.label !== 'string') return null
      if (
        typeof option.value !== 'string' &&
        typeof option.value !== 'number' &&
        typeof option.value !== 'boolean'
      ) {
        return null
      }
      return {
        label: option.label,
        value: option.value,
        disabled: Boolean(option.disabled),
      } as SchemaFormOption
    })
    .filter(Boolean) as SchemaFormOption[]
}

function inferWidget(schema: SchemaFormFieldSchema, uiConfig: SchemaFormUiFieldConfig): string {
  const widget = uiConfig.widget ?? schema['x-ui:widget']
  if (widget) return widget

  if (schema.enum && schema.enum.length > 0) return 'select'

  if (schema.type === 'boolean') return 'switch'
  if (schema.type === 'number' || schema.type === 'integer') return 'number'

  if (schema.type === 'string') {
    if (schema.format === 'date' || schema.format === 'date-time') return 'date'
    return 'text'
  }

  return 'text'
}

function joinPath(basePath: string, segment: string | number): string {
  if (basePath.length === 0) {
    return typeof segment === 'number' ? `[${segment}]` : segment
  }
  return typeof segment === 'number' ? `${basePath}[${segment}]` : `${basePath}.${segment}`
}

function getSelectClass() {
  return cx(
    'border-input bg-background h-9 rounded-component border px-3 text-sm shadow-xs outline-none',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    'disabled:pointer-events-none disabled:opacity-50',
  )
}

// ============================================================================
// Validation
// ============================================================================

function validateSchemaValue(
  schema: SchemaFormFieldSchema,
  value: unknown,
  path: string,
  locale: SchemaFormLocale,
  errors: Record<string, string[]>,
  requiredByParent: boolean,
) {
  const empty = value === undefined || value === null || value === ''

  if (requiredByParent && empty) {
    appendError(errors, path, locale.fieldRequired)
    return
  }

  if (empty) {
    return
  }

  if (schema.const !== undefined && value !== schema.const) {
    appendError(errors, path, locale.constInvalid)
  }

  if (schema.enum && schema.enum.length > 0 && !schema.enum.includes(value)) {
    appendError(errors, path, locale.enumInvalid)
  }

  if (schema.type === 'string') {
    if (typeof value !== 'string') {
      appendError(errors, path, locale.invalidString)
      return
    }
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      appendError(errors, path, locale.minLength(schema.minLength))
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      appendError(errors, path, locale.maxLength(schema.maxLength))
    }
    if (schema.pattern) {
      const regex = new RegExp(schema.pattern)
      if (!regex.test(value)) {
        appendError(errors, path, locale.patternMismatch)
      }
    }
    return
  }

  if (schema.type === 'number' || schema.type === 'integer') {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      appendError(
        errors,
        path,
        schema.type === 'integer' ? locale.invalidInteger : locale.invalidNumber,
      )
      return
    }
    if (schema.type === 'integer' && !Number.isInteger(value)) {
      appendError(errors, path, locale.invalidInteger)
    }
    if (schema.minimum !== undefined && value < schema.minimum) {
      appendError(errors, path, locale.minimum(schema.minimum))
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      appendError(errors, path, locale.maximum(schema.maximum))
    }
    if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) {
      appendError(errors, path, locale.exclusiveMinimum(schema.exclusiveMinimum))
    }
    if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum) {
      appendError(errors, path, locale.exclusiveMaximum(schema.exclusiveMaximum))
    }
    if (schema.multipleOf !== undefined && value % schema.multipleOf !== 0) {
      appendError(errors, path, locale.multipleOf(schema.multipleOf))
    }
    return
  }

  if (schema.type === 'boolean') {
    if (typeof value !== 'boolean') {
      appendError(errors, path, locale.invalidBoolean)
    }
    return
  }

  if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      appendError(errors, path, locale.invalidArray)
      return
    }
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      appendError(errors, path, locale.minItems(schema.minItems))
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      appendError(errors, path, locale.maxItems(schema.maxItems))
    }

    if (schema.items) {
      value.forEach((item, index) => {
        validateSchemaValue(
          schema.items as SchemaFormFieldSchema,
          item,
          `${path}[${index}]`,
          locale,
          errors,
          false,
        )
      })
    }
    return
  }

  if (schema.type === 'object') {
    if (!isObjectLike(value)) {
      appendError(errors, path, locale.invalidObject)
      return
    }

    const objectValue = value as Record<string, unknown>
    const requiredSet = new Set(schema.required ?? [])

    for (const [propertyKey, propertySchema] of Object.entries(schema.properties ?? {})) {
      const childPath = path ? `${path}.${propertyKey}` : propertyKey
      validateSchemaValue(
        propertySchema,
        objectValue[propertyKey],
        childPath,
        locale,
        errors,
        requiredSet.has(propertyKey),
      )
    }
  }
}

// ============================================================================
// Component
// ============================================================================

export function SchemaForm(props: SchemaFormProps) {
  const initialValue = (buildDefaultValue(props.schema) as SchemaFormObject | undefined) ?? {}

  const [local, rest] = splitProps(props, [
    'class',
    'schema',
    'uiSchema',
    'value',
    'defaultValue',
    'onChange',
    'onSubmit',
    'onValidate',
    'zodSchema',
    'optionLoaders',
    'widgetRegistry',
    'validateOn',
    'showSubmitButton',
    'submitText',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): SchemaFormLocale => ({
    ...defaultLocale,
    ...globalLocale.SchemaForm,
    ...local.locale,
  })

  const [internalValue, setInternalValue] = createSignal<SchemaFormObject>(
    local.defaultValue ?? initialValue,
  )
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string[]>>({})
  const [optionsMap, setOptionsMap] = createSignal<Record<string, SchemaFormOption[]>>({})
  const [loadingOptionPaths, setLoadingOptionPaths] = createSignal<Record<string, boolean>>({})

  const values = () => local.value ?? internalValue()

  const shouldShowSubmit = () => local.showSubmitButton !== false

  const setValues = (next: SchemaFormObject) => {
    if (local.value === undefined) {
      setInternalValue(next)
    }
    local.onChange?.(next)
  }

  const setFieldValue = async (path: string, nextValue: unknown) => {
    const nextValues = setAtPath(values(), path, nextValue)
    setValues(nextValues)

    if (local.validateOn === 'change') {
      await runValidation(nextValues)
    }
  }

  const optionLoaderRequests = new Map<string, number>()

  const loadOptionsForPath = async (
    path: string,
    sourceKey: string,
    schema: SchemaFormFieldSchema,
    formValues: SchemaFormObject,
  ) => {
    const loader = local.optionLoaders?.[sourceKey]
    if (!loader) return

    const requestId = (optionLoaderRequests.get(path) ?? 0) + 1
    optionLoaderRequests.set(path, requestId)

    setLoadingOptionPaths(prev => ({ ...prev, [path]: true }))

    try {
      const loaded = await loader({ path, schema, values: formValues })
      if (optionLoaderRequests.get(path) !== requestId) return
      setOptionsMap(prev => ({ ...prev, [path]: normalizeOptions(loaded) }))
    } finally {
      if (optionLoaderRequests.get(path) === requestId) {
        setLoadingOptionPaths(prev => ({ ...prev, [path]: false }))
      }
    }
  }

  const optionFields = createMemo(() => {
    const list: Array<{ path: string; sourceKey: string; schema: SchemaFormFieldSchema }> = []

    const visit = (schema: SchemaFormFieldSchema, path: string) => {
      const ui = local.uiSchema?.[path]
      const sourceKey =
        (ui?.optionsSource as string | undefined) ??
        (schema['x-ui:optionsSource'] as string | undefined)
      if (path && sourceKey) {
        list.push({ path, sourceKey, schema })
      }

      if (schema.type === 'object') {
        for (const [key, property] of Object.entries(schema.properties ?? {})) {
          const childPath = joinPath(path, key)
          visit(property, childPath)
        }
      }

      if (schema.type === 'array' && schema.items?.type === 'object') {
        for (const [key, property] of Object.entries(schema.items.properties ?? {})) {
          const childPath = joinPath(path, key)
          visit(property, childPath)
        }
      }
    }

    visit(local.schema, '')
    return list
  })

  createEffect(() => {
    const formValues = values()
    const fields = optionFields()
    fields.forEach(item => {
      void loadOptionsForPath(item.path, item.sourceKey, item.schema, formValues)
    })
  })

  const getUiConfig = (path: string, schema: SchemaFormFieldSchema): SchemaFormUiFieldConfig => ({
    widget: schema['x-ui:widget'] as string | undefined,
    placeholder: schema['x-ui:placeholder'] as string | undefined,
    help: schema['x-ui:help'] as string | undefined,
    options: normalizeOptions(schema['x-ui:options']),
    optionsSource: schema['x-ui:optionsSource'] as string | undefined,
    dependsOn: schema['x-ui:dependsOn'] as string[] | undefined,
    visibleWhen: schema['x-ui:visibleWhen'] as SchemaFormDynamicRule | undefined,
    disabledWhen: schema['x-ui:disabledWhen'] as SchemaFormDynamicRule | undefined,
    readonlyWhen: schema['x-ui:readonlyWhen'] as SchemaFormDynamicRule | undefined,
    requiredWhen: schema['x-ui:requiredWhen'] as SchemaFormDynamicRule | undefined,
    ...(local.uiSchema?.[path] ?? {}),
  })

  const getFieldOptions = (
    path: string,
    schema: SchemaFormFieldSchema,
    uiConfig: SchemaFormUiFieldConfig,
  ) => {
    if (uiConfig.options && uiConfig.options.length > 0) {
      return uiConfig.options
    }

    if (schema.enum && schema.enum.length > 0) {
      return schema.enum
        .filter(item => ['string', 'number', 'boolean'].includes(typeof item))
        .map(item => ({
          label: String(item),
          value: item as string | number | boolean,
          disabled: false,
        }))
    }

    return optionsMap()[path] ?? []
  }

  const getRuntimeState = (
    path: string,
    schema: SchemaFormFieldSchema,
    baseRequired: boolean,
  ): { visible: boolean; disabled: boolean; readonly: boolean; required: boolean } => {
    const uiConfig = getUiConfig(path, schema)
    const context: SchemaFormDynamicRuleContext = {
      path,
      values: values(),
      schema,
    }

    const visible = evaluateRule(uiConfig.visibleWhen, true, context)
    const disabled = evaluateRule(uiConfig.disabledWhen, false, context)
    const readonly = evaluateRule(uiConfig.readonlyWhen, false, context)
    const required = evaluateRule(uiConfig.requiredWhen, baseRequired, context)

    return {
      visible,
      disabled,
      readonly,
      required,
    }
  }

  const normalizeZodErrors = (error: SchemaFormZodErrorLike | undefined) => {
    const output: Record<string, string[]> = {}
    for (const issue of error?.issues ?? []) {
      const issuePath = toErrorPath(issue.path ?? [])
      appendError(output, issuePath, issue.message)
    }
    return output
  }

  const runValidation = async (nextValues: SchemaFormObject) => {
    const errors: Record<string, string[]> = {}

    validateSchemaValue(local.schema, nextValues, '', locale(), errors, false)

    if (local.zodSchema) {
      if (typeof local.zodSchema.safeParse === 'function') {
        const result = local.zodSchema.safeParse(nextValues)
        if (!result.success) {
          const zodErrors = normalizeZodErrors(result.error)
          for (const [path, messages] of Object.entries(zodErrors)) {
            messages.forEach(message => appendError(errors, path, message))
          }
        }
      } else if (typeof local.zodSchema.parse === 'function') {
        try {
          local.zodSchema.parse(nextValues)
        } catch (error) {
          const zodErrors = normalizeZodErrors(error as SchemaFormZodErrorLike)
          for (const [path, messages] of Object.entries(zodErrors)) {
            messages.forEach(message => appendError(errors, path, message))
          }
        }
      }
    }

    if (local.onValidate) {
      const result = local.onValidate(nextValues)
      const validation = result instanceof Promise ? await result : result
      if (!validation.valid && validation.errors) {
        const normalized = toErrorRecord(validation.errors)
        for (const [path, messages] of Object.entries(normalized)) {
          messages.forEach(message => appendError(errors, path, message))
        }
      }
    }

    const fieldStates: Array<{ path: string; visible: boolean; required: boolean }> = []

    const walkFieldState = (schema: SchemaFormFieldSchema, path: string, baseRequired: boolean) => {
      const uiConfig = getUiConfig(path, schema)
      const context: SchemaFormDynamicRuleContext = {
        path,
        values: nextValues,
        schema,
      }

      const visible = evaluateRule(uiConfig.visibleWhen, true, context)
      const required = evaluateRule(uiConfig.requiredWhen, baseRequired, context)

      fieldStates.push({ path, visible, required })

      if (schema.type === 'object') {
        const requiredSet = new Set(schema.required ?? [])
        for (const [key, property] of Object.entries(schema.properties ?? {})) {
          const childPath = joinPath(path, key)
          walkFieldState(property, childPath, requiredSet.has(key))
        }
      }

      if (schema.type === 'array' && schema.items) {
        const current = getAtPath(nextValues, path)
        const list = Array.isArray(current) ? current : []
        list.forEach((_, index) => {
          const itemPath = joinPath(path, index)
          walkFieldState(schema.items as SchemaFormFieldSchema, itemPath, false)
        })
      }
    }

    walkFieldState(local.schema, '', false)

    const hiddenPaths = fieldStates
      .filter(item => item.path && !item.visible)
      .map(item => item.path)

    for (const hiddenPath of hiddenPaths) {
      for (const errorPath of Object.keys(errors)) {
        if (
          errorPath === hiddenPath ||
          errorPath.startsWith(`${hiddenPath}.`) ||
          errorPath.startsWith(`${hiddenPath}[`)
        ) {
          delete errors[errorPath]
        }
      }
    }

    fieldStates
      .filter(item => item.path && item.visible && item.required)
      .forEach(item => {
        const value = getAtPath(nextValues, item.path)
        if (isEmptyValue(value)) {
          appendError(errors, item.path, locale().fieldRequired)
        }
      })

    setFieldErrors(errors)

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    }
  }

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()

    const currentValues = values()
    const validation = await runValidation(currentValues)
    if (!validation.valid) return

    await local.onSubmit?.(currentValues)
  }

  const renderPrimitiveField = (
    path: string,
    schema: SchemaFormFieldSchema,
    baseRequired: boolean,
    inferredLabel?: string,
  ) => {
    const uiConfig = getUiConfig(path, schema)
    const state = getRuntimeState(path, schema, baseRequired)

    if (!state.visible) return null

    const value = getAtPath(values(), path)
    const errors = fieldErrors()[path] ?? []
    const placeholder = uiConfig.placeholder
    const options = getFieldOptions(path, schema, uiConfig)
    const widget = inferWidget(schema, uiConfig)
    const loadingOptions = !!loadingOptionPaths()[path]

    const customRenderer = local.widgetRegistry?.[widget]
    if (customRenderer) {
      return customRenderer({
        path,
        schema,
        value,
        values: values(),
        required: state.required,
        disabled: state.disabled,
        readonly: state.readonly,
        errors,
        options,
        locale: locale(),
        setValue: next => {
          void setFieldValue(path, next)
        },
      })
    }

    const label = schema.title ?? inferredLabel
    const helpText = uiConfig.help ?? schema.description

    if (widget === 'textarea') {
      return (
        <FormField label={label} required={state.required} error={errors} description={helpText}>
          <TextField>
            <TextFieldTextArea
              name={path}
              value={typeof value === 'string' ? value : ''}
              placeholder={placeholder}
              required={state.required}
              disabled={state.disabled}
              readonly={state.readonly}
              onInput={event => {
                void setFieldValue(path, event.currentTarget.value)
              }}
            />
          </TextField>
        </FormField>
      )
    }

    if (widget === 'number') {
      return (
        <FormField label={label} required={state.required} error={errors} description={helpText}>
          <TextField>
            <TextFieldInput
              type="number"
              name={path}
              value={typeof value === 'number' ? String(value) : ''}
              placeholder={placeholder}
              required={state.required}
              disabled={state.disabled}
              readonly={state.readonly}
              min={schema.minimum}
              max={schema.maximum}
              step={schema.type === 'integer' ? 1 : 'any'}
              onInput={event => {
                const raw = event.currentTarget.value
                if (!raw.length) {
                  void setFieldValue(path, undefined)
                  return
                }
                const parsed = schema.type === 'integer' ? Number.parseInt(raw, 10) : Number(raw)
                void setFieldValue(path, Number.isNaN(parsed) ? undefined : parsed)
              }}
            />
          </TextField>
        </FormField>
      )
    }

    if (widget === 'date') {
      return (
        <FormField label={label} required={state.required} error={errors} description={helpText}>
          <TextField>
            <TextFieldInput
              type="date"
              name={path}
              value={typeof value === 'string' ? value : ''}
              required={state.required}
              disabled={state.disabled}
              readonly={state.readonly}
              onInput={event => {
                void setFieldValue(path, event.currentTarget.value)
              }}
            />
          </TextField>
        </FormField>
      )
    }

    if (widget === 'select') {
      return (
        <FormField label={label} required={state.required} error={errors} description={helpText}>
          <select
            name={path}
            class={getSelectClass()}
            value={
              typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
                ? String(value)
                : ''
            }
            required={state.required}
            disabled={state.disabled}
            onChange={event => {
              const selected = event.currentTarget.value
              const matched = options.find(option => String(option.value) === selected)
              void setFieldValue(path, matched?.value)
            }}
          >
            <option value="">{placeholder ?? locale().selectPlaceholder}</option>
            <For each={options}>
              {option => (
                <option value={String(option.value)} disabled={option.disabled}>
                  {option.label}
                </option>
              )}
            </For>
          </select>
          <Show when={loadingOptions}>
            <p class="text-muted-foreground text-xs">{locale().loadingOptions}</p>
          </Show>
        </FormField>
      )
    }

    if (widget === 'radio') {
      return (
        <FormField label={label} required={state.required} error={errors} description={helpText}>
          <RadioGroup
            value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
            disabled={state.disabled}
            onChange={next => {
              const matched = options.find(option => String(option.value) === next)
              void setFieldValue(path, matched?.value)
            }}
          >
            <For each={options}>
              {option => (
                <RadioGroupItem value={String(option.value)}>
                  <RadioGroupItemInput disabled={option.disabled || state.readonly} />
                  <RadioGroupItemControl>
                    <RadioGroupItemIndicator />
                  </RadioGroupItemControl>
                  <RadioGroupItemLabel>{option.label}</RadioGroupItemLabel>
                </RadioGroupItem>
              )}
            </For>
          </RadioGroup>
        </FormField>
      )
    }

    if (widget === 'checkbox') {
      return (
        <FormField label={label} required={state.required} error={errors} description={helpText}>
          <Checkbox
            checked={Boolean(value)}
            disabled={state.disabled}
            onChange={next => {
              void setFieldValue(path, next)
            }}
          >
            <CheckboxInput disabled={state.readonly} />
            <CheckboxControl />
            <span class="text-sm">{placeholder ?? locale().booleanLabel}</span>
          </Checkbox>
        </FormField>
      )
    }

    if (widget === 'switch') {
      return (
        <FormField label={label} required={state.required} error={errors} description={helpText}>
          <Switch
            checked={Boolean(value)}
            disabled={state.disabled}
            onChange={next => {
              void setFieldValue(path, next)
            }}
          >
            <SwitchInput disabled={state.readonly} />
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
          </Switch>
        </FormField>
      )
    }

    return (
      <FormField label={label} required={state.required} error={errors} description={helpText}>
        <TextField>
          <TextFieldInput
            type={schema.format === 'email' || schema.format === 'url' ? schema.format : 'text'}
            name={path}
            value={typeof value === 'string' ? value : ''}
            placeholder={placeholder}
            required={state.required}
            disabled={state.disabled}
            readonly={state.readonly}
            onInput={event => {
              void setFieldValue(path, event.currentTarget.value)
            }}
          />
        </TextField>
      </FormField>
    )
  }

  const renderSchemaNode = (
    schema: SchemaFormFieldSchema,
    path: string,
    baseRequired: boolean,
    inferredLabel?: string,
  ): JSX.Element | null => {
    if (schema.type === 'object') {
      const runtime = getRuntimeState(path, schema, baseRequired)
      if (!runtime.visible) return null

      const orderList = (schema['x-ui:order'] as string[] | undefined) ?? []
      const keys = Object.keys(schema.properties ?? {})
      const orderedKeys =
        orderList.length > 0
          ? [
              ...orderList.filter(key => keys.includes(key)),
              ...keys.filter(key => !orderList.includes(key)),
            ]
          : keys

      const requiredSet = new Set(schema.required ?? [])
      const title = schema.title ?? inferredLabel

      return (
        <div
          data-slot="schema-form-object"
          class={cx(path && 'rounded-component border p-4', 'space-y-4')}
        >
          <Show when={title && path}>
            <h3 class="text-base font-semibold">{title}</h3>
          </Show>
          <Show when={schema.description && path}>
            <p class="text-muted-foreground text-sm">{schema.description}</p>
          </Show>
          <For each={orderedKeys}>
            {key =>
              renderSchemaNode(
                (schema.properties ?? {})[key] as SchemaFormFieldSchema,
                joinPath(path, key),
                requiredSet.has(key),
                humanizeKey(key),
              )
            }
          </For>
        </div>
      )
    }

    if (schema.type === 'array') {
      const runtime = getRuntimeState(path, schema, baseRequired)
      if (!runtime.visible) return null

      const title = schema.title ?? inferredLabel
      const description = schema.description
      const arrayValue = getAtPath(values(), path)
      const items = Array.isArray(arrayValue) ? arrayValue : []
      const canAdd = schema.maxItems === undefined || items.length < schema.maxItems
      const canRemove = schema.minItems === undefined || items.length > schema.minItems

      return (
        <div data-slot="schema-form-array" class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <div>
              <Show when={title}>
                <h3 class="text-sm font-medium">{title}</h3>
              </Show>
              <Show when={description}>
                <p class="text-muted-foreground text-sm">{description}</p>
              </Show>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!canAdd || runtime.disabled || runtime.readonly}
              onClick={() => {
                const defaultItem = buildDefaultValue(schema.items)
                const nextValues = appendToArrayPath(values(), path, defaultItem)
                setValues(nextValues)
              }}
            >
              {locale().addItem}
            </Button>
          </div>

          <Show when={items.length > 0} fallback={<p class="text-muted-foreground text-sm">[]</p>}>
            <div class="space-y-3">
              <For each={items}>
                {(item, index) => {
                  const itemPath = joinPath(path, index())
                  const label = `${title ?? locale().arrayItem} #${index() + 1}`

                  return (
                    <div class="rounded-component border p-3" data-slot="schema-form-array-item">
                      <div class="mb-3 flex items-center justify-between gap-2">
                        <p class="text-sm font-medium">{label}</p>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={!canRemove || runtime.disabled || runtime.readonly}
                          onClick={() => {
                            const nextValues = removeArrayPathIndex(values(), path, index())
                            setValues(nextValues)
                          }}
                        >
                          {locale().removeItem}
                        </Button>
                      </div>

                      <Show
                        when={schema.items}
                        fallback={<p class="text-muted-foreground text-sm">{String(item ?? '')}</p>}
                      >
                        {renderSchemaNode(
                          schema.items as SchemaFormFieldSchema,
                          itemPath,
                          false,
                          `${locale().arrayItem} ${index() + 1}`,
                        )}
                      </Show>
                    </div>
                  )
                }}
              </For>
            </div>
          </Show>
        </div>
      )
    }

    return renderPrimitiveField(path, schema, baseRequired, inferredLabel)
  }

  return (
    <form
      data-slot="schema-form"
      class={cx('space-y-5', local.class)}
      onSubmit={handleSubmit}
      {...rest}
    >
      {renderSchemaNode(local.schema, '', false)}

      <Show when={fieldErrors()['']?.length}>
        <div data-slot="schema-form-root-error" class="text-destructive text-sm">
          <For each={fieldErrors()['']}>{message => <p>{message}</p>}</For>
        </div>
      </Show>

      <Show when={shouldShowSubmit()}>
        <Button type="submit">{local.submitText ?? locale().submit}</Button>
      </Show>
    </form>
  )
}
