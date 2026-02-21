import 'next-intl';

type Messages = typeof import('../messages/ru.json');

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
