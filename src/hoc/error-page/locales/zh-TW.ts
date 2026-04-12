import type { ErrorPageLocale } from 'shadcn-solid-components/i18n/types'

export const zhTW: ErrorPageLocale = {
  titles: {
    '404': '頁面未找到',
    '403': '存取被拒絕',
    '500': '伺服器內部錯誤',
    '503': '服務不可用',
    generic: '出了點問題',
  },
  descriptions: {
    '404': '抱歉，您存取的頁面不存在或已被移動。',
    '403': '您沒有權限存取此頁面，請聯繫管理員。',
    '500': '伺服器發生了意外錯誤，請稍後重試。',
    '503': '服務暫時不可用，請幾分鐘後重試。',
    generic: '發生了意外錯誤，請稍後重試。',
  },
  goHome: '返回首頁',
}
