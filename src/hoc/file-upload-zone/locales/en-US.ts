import type { FileUploadZoneLocale } from 'shadcn-solid-components/i18n/types'

export const enUS: FileUploadZoneLocale = {
  dropHere: 'Drag & drop files here',
  browse: 'Browse',
  or: 'or',
  remove: 'Remove',
  maxSize: size => `Max file size: ${size}`,
  maxFiles: count => `Max ${count} file(s)`,
  invalidType: 'File type not allowed.',
  fileTooLarge: 'File is too large.',
}
