import type { TransferListLocale } from '@/i18n/types'

export const jaJP: TransferListLocale = {
  sourceTitle: '利用可能',
  targetTitle: '選択済み',
  searchPlaceholder: '検索…',
  moveRight: '右へ移動',
  moveAllRight: 'すべて右へ',
  moveLeft: '左へ移動',
  moveAllLeft: 'すべて左へ',
  selected: (count, total) => `${count}/${total} 選択済み`,
  noData: 'データなし',
}
