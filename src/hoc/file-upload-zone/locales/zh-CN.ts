import type { FileUploadZoneLocale } from '@/i18n/types'

export const zhCN: FileUploadZoneLocale = {
  dropHere: '拖放文件到此处',
  browse: '浏览',
  or: '或',
  remove: '移除',
  maxSize: size => `文件最大: ${size}`,
  maxFiles: count => `最多 ${count} 个文件`,
  invalidType: '文件类型不允许。',
  fileTooLarge: '文件太大。',
}
