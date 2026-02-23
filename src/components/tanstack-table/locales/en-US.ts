import type { TanstackTableLocale } from '@/i18n/types'

export const enUS: TanstackTableLocale = {
  noResults: 'No results.',
  selectAll: 'Select all',
  selectRow: 'Select row',
  selectedCount: (selected, total) => `${selected} of ${total} row(s) selected.`,
  expandRow: 'Expand row',
  collapseRow: 'Collapse row',
  search: 'Search...',
  rowsPerPage: 'Rows per page',
  pageInfo: (page, totalPages) => `Page ${page} of ${totalPages}`,
  firstPage: 'Go to first page',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  lastPage: 'Go to last page',
}
