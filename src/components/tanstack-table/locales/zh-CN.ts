import type { TanstackTableLocale } from '@/i18n/types'

export const zhCN: TanstackTableLocale = {
  noResults: '暂无数据',
  selectAll: '全选',
  selectRow: '选择行',
  selectedCount: (selected, total) => `已选择 ${selected} / ${total} 行`,
  expandRow: '展开行',
  collapseRow: '收起行',
  search: '搜索...',
  rowsPerPage: '每页行数',
  pageInfo: (page, totalPages) => `第 ${page} 页，共 ${totalPages} 页`,
  firstPage: '跳转到首页',
  previousPage: '上一页',
  nextPage: '下一页',
  lastPage: '跳转到末页',
}
