import type { TransferListLocale } from 'shadcn-solid-components/i18n/types'

export const enUS: TransferListLocale = {
  sourceTitle: 'Available',
  targetTitle: 'Selected',
  searchPlaceholder: 'Search...',
  moveRight: 'Move right',
  moveAllRight: 'Move all right',
  moveLeft: 'Move left',
  moveAllLeft: 'Move all left',
  selected: (count, total) => `${count}/${total} selected`,
  noData: 'No items',
}
