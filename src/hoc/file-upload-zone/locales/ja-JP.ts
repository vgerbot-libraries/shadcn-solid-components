import type { FileUploadZoneLocale } from 'shadcn-solid-components/i18n/types'

export const jaJP: FileUploadZoneLocale = {
  dropHere: 'ファイルをここにドラッグ＆ドロップ',
  browse: '参照',
  or: 'または',
  remove: '削除',
  maxSize: size => `最大ファイルサイズ: ${size}`,
  maxFiles: count => `最大 ${count} ファイル`,
  invalidType: 'このファイル形式は許可されていません。',
  fileTooLarge: 'ファイルが大きすぎます。',
}
