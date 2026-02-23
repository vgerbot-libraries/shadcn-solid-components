import type { TanstackTableLocale } from '@/i18n/types'

export const zhTW: TanstackTableLocale = {
  noResults: '暫無資料',
  selectAll: '全選',
  selectRow: '選取列',
  selectedCount: (selected, total) => `已選取 ${selected} / ${total} 列`,
  expandRow: '展開列',
  collapseRow: '收合列',
  search: '搜尋...',
  rowsPerPage: '每頁列數',
  pageInfo: (page, totalPages) => `第 ${page} 頁，共 ${totalPages} 頁`,
  firstPage: '前往首頁',
  previousPage: '上一頁',
  nextPage: '下一頁',
  lastPage: '前往末頁',
}
