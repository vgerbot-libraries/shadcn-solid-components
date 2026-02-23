import type { FileUploadZoneLocale } from '@/i18n/types'

export const zhTW: FileUploadZoneLocale = {
  dropHere: '拖放檔案到此處',
  browse: '瀏覽',
  or: '或',
  remove: '移除',
  maxSize: size => `檔案最大: ${size}`,
  maxFiles: count => `最多 ${count} 個檔案`,
  invalidType: '檔案類型不允許。',
  fileTooLarge: '檔案太大。',
}
