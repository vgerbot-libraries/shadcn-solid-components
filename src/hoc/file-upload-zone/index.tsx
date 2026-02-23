import { useLocale } from '@/components/config-provider'
import type { FileUploadZoneLocale } from '@/i18n/types'
import { enUS as defaultLocale } from './locales/en-US'
import { type ComponentProps, createSignal, For, type JSX, Show, splitProps } from 'solid-js'
import { Button } from '@/components/button'
import { Progress } from '@/components/progress'
import { cx } from '@/lib/cva'

// ============================================================================


export const enLocale: FileUploadZoneLocale = {
  dropHere: 'Drag & drop files here',
  browse: 'Browse',
  or: 'or',
  remove: 'Remove',
  maxSize: size => `Max file size: ${size}`,
  maxFiles: count => `Max ${count} file(s)`,
  invalidType: 'File type not allowed.',
  fileTooLarge: 'File is too large.',
}

export const zhCNLocale: FileUploadZoneLocale = {
  dropHere: '拖放文件到此处',
  browse: '浏览',
  or: '或',
  remove: '移除',
  maxSize: size => `文件最大: ${size}`,
  maxFiles: count => `最多 ${count} 个文件`,
  invalidType: '文件类型不允许。',
  fileTooLarge: '文件太大。',
}

export const zhTWLocale: FileUploadZoneLocale = {
  dropHere: '拖放檔案到此處',
  browse: '瀏覽',
  or: '或',
  remove: '移除',
  maxSize: size => `檔案最大: ${size}`,
  maxFiles: count => `最多 ${count} 個檔案`,
  invalidType: '檔案類型不允許。',
  fileTooLarge: '檔案太大。',
}

export const jaLocale: FileUploadZoneLocale = {
  dropHere: 'ファイルをここにドラッグ＆ドロップ',
  browse: '参照',
  or: 'または',
  remove: '削除',
  maxSize: size => `最大ファイルサイズ: ${size}`,
  maxFiles: count => `最大 ${count} ファイル`,
  invalidType: 'このファイル形式は許可されていません。',
  fileTooLarge: 'ファイルが大きすぎます。',
}

// ============================================================================
// Types
// ============================================================================

export interface UploadFile {
  /** The original File object. */
  file: File
  /** Unique id for tracking. */
  id: string
  /** Upload progress percentage (0-100). */
  progress?: number
  /** Current status. */
  status: 'pending' | 'uploading' | 'done' | 'error'
  /** Error message if status is 'error'. */
  error?: string
  /** Preview URL (for images). */
  preview?: string
}

export interface FileUploadZoneProps extends ComponentProps<'div'> {
  /** Accepted file types (MIME or extension), e.g. `'image/*,.pdf'`. */
  accept?: string
  /** Max file size in bytes. */
  maxSize?: number
  /** Max number of files. Defaults to unlimited. */
  maxFiles?: number
  /** Allow multiple file selection. Defaults to `true`. */
  multiple?: boolean
  /** Current files (controlled). */
  value?: UploadFile[]
  /** Called when files are added. */
  onFilesAdd?: (files: File[]) => void
  /** Called when a file is removed. */
  onRemove?: (file: UploadFile) => void
  /** Disabled state. */
  disabled?: boolean
  /** Locale overrides. */
  locale?: Partial<FileUploadZoneLocale>
}

// ============================================================================
// Helpers
// ============================================================================

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function isValidType(file: File, accept: string): boolean {
  if (!accept) return true
  const acceptedTypes = accept.split(',').map(t => t.trim())
  return acceptedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase())
    }
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.replace('/*', '/'))
    }
    return file.type === type
  })
}

function FileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="size-10 text-muted-foreground"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M14 2v4a2 2 0 0 0 2 2h4"
      />
    </svg>
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * A drag-and-drop file upload zone with file preview, progress, and validation.
 *
 * @example
 * ```tsx
 * <FileUploadZone
 *   accept="image/*,.pdf"
 *   maxSize={5 * 1024 * 1024}
 *   maxFiles={3}
 *   onFilesAdd={files => handleUpload(files)}
 *   onRemove={file => handleRemove(file)}
 *   value={uploadedFiles()}
 * />
 * ```
 */
export function FileUploadZone(props: FileUploadZoneProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'accept',
    'maxSize',
    'maxFiles',
    'multiple',
    'value',
    'onFilesAdd',
    'onRemove',
    'disabled',
    'locale',
  ])

  const globalLocale = useLocale()
  const locale = (): FileUploadZoneLocale => ({ ...defaultLocale, ...globalLocale.FileUploadZone, ...local.locale })
  const multiple = () => local.multiple !== false

  const [isDragging, setIsDragging] = createSignal(false)
  const [errors, setErrors] = createSignal<string[]>([])

  let inputRef!: HTMLInputElement

  const validateFiles = (files: File[]): File[] => {
    const errs: string[] = []
    const valid: File[] = []

    for (const file of files) {
      if (local.accept && !isValidType(file, local.accept)) {
        errs.push(`${file.name}: ${locale().invalidType}`)
        continue
      }
      if (local.maxSize && file.size > local.maxSize) {
        errs.push(`${file.name}: ${locale().fileTooLarge}`)
        continue
      }
      valid.push(file)
    }

    if (local.maxFiles) {
      const currentCount = local.value?.length ?? 0
      const allowed = local.maxFiles - currentCount
      if (valid.length > allowed) {
        errs.push(locale().maxFiles(local.maxFiles))
        valid.splice(allowed)
      }
    }

    setErrors(errs)
    return valid
  }

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || local.disabled) return
    const files = Array.from(fileList)
    const valid = validateFiles(files)
    if (valid.length > 0) {
      local.onFilesAdd?.(valid)
    }
    if (inputRef) inputRef.value = ''
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    if (!local.disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer?.files ?? null)
  }

  return (
    <div data-slot="file-upload-zone" class={cx('flex flex-col gap-3', local.class)} {...rest}>
      {/* Drop area */}
      <div
        class={cx(
          'relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors',
          isDragging() && 'border-primary bg-primary/5',
          !isDragging() && 'border-muted-foreground/25 hover:border-muted-foreground/50',
          local.disabled && 'pointer-events-none opacity-50',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FileIcon />
        <div class="flex flex-col gap-1">
          <p class="text-sm font-medium">
            {locale().dropHere} <span class="text-muted-foreground">{locale().or}</span>{' '}
            <button
              type="button"
              class="text-primary cursor-pointer underline underline-offset-4"
              onClick={() => inputRef?.click()}
            >
              {locale().browse}
            </button>
          </p>
          <div class="text-muted-foreground flex flex-wrap justify-center gap-2 text-xs">
            <Show when={local.maxSize}>
              <span>{locale().maxSize(formatBytes(local.maxSize!))}</span>
            </Show>
            <Show when={local.maxFiles}>
              <span>{locale().maxFiles(local.maxFiles!)}</span>
            </Show>
          </div>
        </div>

        <input
          ref={inputRef!}
          type="file"
          class="sr-only"
          accept={local.accept}
          multiple={multiple()}
          disabled={local.disabled}
          onChange={e => handleFiles(e.currentTarget.files)}
        />
      </div>

      {/* Validation errors */}
      <Show when={errors().length > 0}>
        <div class="text-destructive text-sm">
          <For each={errors()}>{err => <p>{err}</p>}</For>
        </div>
      </Show>

      {/* File list */}
      <Show when={local.value && local.value.length > 0}>
        <ul class="flex flex-col gap-2">
          <For each={local.value}>
            {file => (
              <li class="flex items-center gap-3 rounded-md border p-3">
                <Show
                  when={file.preview}
                  fallback={
                    <div class="bg-muted flex size-10 shrink-0 items-center justify-center rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="text-muted-foreground size-5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v4a2 2 0 0 0 2 2h4"
                        />
                      </svg>
                    </div>
                  }
                >
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    class="size-10 shrink-0 rounded object-cover"
                  />
                </Show>

                <div class="flex min-w-0 flex-1 flex-col gap-1">
                  <div class="flex items-center justify-between">
                    <span class="truncate text-sm font-medium">{file.file.name}</span>
                    <span class="text-muted-foreground shrink-0 text-xs">
                      {formatBytes(file.file.size)}
                    </span>
                  </div>

                  <Show when={file.status === 'uploading' && file.progress !== undefined}>
                    <Progress value={file.progress} class="h-1.5" />
                  </Show>

                  <Show when={file.status === 'error' && file.error}>
                    <span class="text-destructive text-xs">{file.error}</span>
                  </Show>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  class="shrink-0"
                  onClick={() => local.onRemove?.(file)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18 6L6 18M6 6l12 12"
                    />
                  </svg>
                  <span class="sr-only">{locale().remove}</span>
                </Button>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  )
}
