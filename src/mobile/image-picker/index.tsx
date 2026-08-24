import { useLocale } from 'shadcn-solid-components/components/config-provider'
import { IconX } from 'shadcn-solid-components/components/icons'
import type { ImagePickerLocale } from 'shadcn-solid-components/i18n/types'
import { cx } from 'shadcn-solid-components/lib/cva'
import { ComponentName } from 'shadcn-solid-components/lib/theme-context'
import { useComponentClass } from 'shadcn-solid-components/lib/theme-helpers'
import {
  type ComponentProps,
  createMemo,
  createSignal,
  For,
  mergeProps,
  onCleanup,
  Show,
  splitProps,
  untrack,
} from 'solid-js'
import { enUS as defaultLocale } from './locales/en-US'

// ============================================================================
// Types
// ============================================================================

export interface ImagePickerProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  files?: string[]
  defaultFiles?: string[]
  action?: 'camera' | 'photos' | 'mix'
  maxCount?: number
  disabled?: boolean
  accept?: string
  onChange?: (files: string[]) => void
  onAddBefore?: () => boolean
}

// ============================================================================
// Component
// ============================================================================

export const ImagePicker = (props: ImagePickerProps) => {
  const merge = mergeProps(
    {
      defaultFiles: [] as string[],
      action: 'mix' as const,
      accept: 'image/*',
    },
    props,
  )
  const [local, rest] = splitProps(merge, [
    'class',
    'files',
    'defaultFiles',
    'action',
    'maxCount',
    'disabled',
    'accept',
    'onChange',
    'onAddBefore',
  ])
  const componentClass = useComponentClass(ComponentName.ImagePicker, props)

  const locale = (): ImagePickerLocale => ({
    ...defaultLocale,
    ...useLocale().ImagePicker,
  })

  const isControlled = () => local.files !== undefined
  const [uncontrolledFiles, setUncontrolledFiles] = createSignal<string[]>(
    untrack(() => local.defaultFiles ?? []),
  )
  const createdUrls = new Set<string>()
  let inputRef: HTMLInputElement | undefined

  const currentFiles = createMemo(() =>
    isControlled() ? (local.files ?? []) : uncontrolledFiles(),
  )
  const remaining = createMemo(() =>
    local.maxCount === undefined
      ? Number.POSITIVE_INFINITY
      : local.maxCount - currentFiles().length,
  )
  const showAdd = createMemo(() => !local.disabled && remaining() > 0)
  const multiple = createMemo(() => remaining() > 1)

  const commit = (next: string[]) => {
    if (!isControlled()) {
      setUncontrolledFiles(next)
    }

    local.onChange?.(next)
  }

  const handleAdd = () => {
    if (local.disabled) {
      return
    }

    if (local.onAddBefore?.() === false) {
      return
    }

    inputRef?.click()
  }

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return
    }

    const limit = remaining()
    const selected = Array.from(fileList).slice(0, Number.isFinite(limit) ? limit : undefined)
    const urls = selected.map(file => {
      const url = URL.createObjectURL(file)
      createdUrls.add(url)
      return url
    })

    commit([...currentFiles(), ...urls])

    if (inputRef) {
      inputRef.value = ''
    }
  }

  const handleRemove = (index: number) => {
    const next = currentFiles().filter((_, itemIndex) => itemIndex !== index)
    const removed = currentFiles()[index]
    if (removed?.startsWith('blob:') && createdUrls.has(removed)) {
      URL.revokeObjectURL(removed)
      createdUrls.delete(removed)
    }

    commit(next)
  }

  onCleanup(() => {
    for (const url of createdUrls) {
      URL.revokeObjectURL(url)
    }

    createdUrls.clear()
  })

  return (
    <div
      data-slot="image-picker"
      class={cx('flex flex-wrap gap-2.5', componentClass, local.class)}
      {...rest}
    >
      <For each={currentFiles()}>
        {(file, index) => (
          <div data-slot="image-picker-file" class="relative size-[85px]">
            <img
              data-slot="image-picker-image"
              src={file}
              alt=""
              class="size-[85px] rounded-[5px] object-cover"
            />
            <button
              type="button"
              data-slot="image-picker-delete"
              class="absolute top-[2.5px] right-[2.5px] flex size-[15px] cursor-pointer items-center justify-center rounded-full bg-black/50 text-white"
              aria-label={locale().remove}
              disabled={local.disabled}
              onClick={() => handleRemove(index())}
            >
              <IconX class="size-3" />
            </button>
          </div>
        )}
      </For>

      <Show when={showAdd()}>
        <button
          type="button"
          data-slot="image-picker-add"
          class="bg-muted text-muted-foreground flex size-[85px] cursor-pointer flex-col items-center justify-center gap-1 rounded-[5px]"
          disabled={local.disabled}
          onClick={handleAdd}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-6" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 8h.01M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm3 11l3.5-4.5l2.5 3l3.5-4.5L21 17"
            />
          </svg>
          <span class="px-1 text-center text-xs leading-[16.5px]">
            {local.action === 'camera' ? locale().cameraUpload : locale().upload}
          </span>
        </button>
      </Show>

      <input
        ref={inputRef}
        type="file"
        class="sr-only"
        accept={local.accept}
        multiple={multiple()}
        disabled={local.disabled}
        capture={local.action === 'camera' ? 'environment' : undefined}
        onChange={event => handleFiles(event.currentTarget.files)}
      />
    </div>
  )
}
