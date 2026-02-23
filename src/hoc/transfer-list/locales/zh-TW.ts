import type { TransferListLocale } from '@/i18n/types'

export const zhTW: TransferListLocale = {
  sourceTitle: '可選',
  targetTitle: '已選',
  searchPlaceholder: '搜尋…',
  moveRight: '移至右側',
  moveAllRight: '全部移至右側',
  moveLeft: '移至左側',
  moveAllLeft: '全部移至左側',
  selected: (count, total) => `${count}/${total} 已選`,
  noData: '暫無資料',
}
