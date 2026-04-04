import type { TanstackTableLocale } from 'shadcn-solid-components/i18n/types'

export const jaJP: TanstackTableLocale = {
  noResults: 'データがありません',
  selectAll: 'すべて選択',
  selectRow: '行を選択',
  selectedCount: (selected, total) => `${total} 件中 ${selected} 件を選択`,
  expandRow: '行を展開',
  collapseRow: '行を折りたたむ',
  search: '検索...',
  rowsPerPage: 'ページあたりの行数',
  pageInfo: (page, totalPages) => `${totalPages} ページ中 ${page} ページ`,
  firstPage: '最初のページへ',
  previousPage: '前のページへ',
  nextPage: '次のページへ',
  lastPage: '最後のページへ',
}
