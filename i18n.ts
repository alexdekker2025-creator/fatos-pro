import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // This config is not used for static locale routing
  // but next-intl requires it to exist
  return {
    messages: {}
  };
});
