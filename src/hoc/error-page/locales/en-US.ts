import type { ErrorPageLocale } from 'shadcn-solid-components/i18n/types'

export const enUS: ErrorPageLocale = {
  titles: {
    '404': 'Page not found',
    '403': 'Access denied',
    '500': 'Internal server error',
    '503': 'Service unavailable',
    generic: 'Something went wrong',
  },
  descriptions: {
    '404': "Sorry, the page you are looking for doesn't exist or has been moved.",
    '403': "You don't have permission to access this page. Please contact your administrator.",
    '500': 'An unexpected error occurred on the server. Please try again later.',
    '503': 'The service is temporarily unavailable. Please try again in a few minutes.',
    generic: 'An unexpected error occurred. Please try again later.',
  },
  goHome: 'Go back home',
}
