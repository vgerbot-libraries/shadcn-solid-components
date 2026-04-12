import type { ErrorPageLocale } from 'shadcn-solid-components/i18n/types'

export const zhCN: ErrorPageLocale = {
  titles: {
    '404': '页面未找到',
    '403': '访问被拒绝',
    '500': '服务器内部错误',
    '503': '服务不可用',
    generic: '出了点问题',
  },
  descriptions: {
    '404': '抱歉，您访问的页面不存在或已被移动。',
    '403': '您没有权限访问此页面，请联系管理员。',
    '500': '服务器发生了意外错误，请稍后重试。',
    '503': '服务暂时不可用，请几分钟后重试。',
    generic: '发生了意外错误，请稍后重试。',
  },
  goHome: '返回首页',
}
