import type { TransferListLocale } from '@/i18n/types'

export const zhCN: TransferListLocale = {
  sourceTitle: '可选',
  targetTitle: '已选',
  searchPlaceholder: '搜索…',
  moveRight: '移至右侧',
  moveAllRight: '全部移至右侧',
  moveLeft: '移至左侧',
  moveAllLeft: '全部移至左侧',
  selected: (count, total) => `${count}/${total} 已选`,
  noData: '暂无数据',
}
