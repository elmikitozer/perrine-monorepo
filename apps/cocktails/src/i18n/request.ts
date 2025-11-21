import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from request
  let locale = await requestLocale;

  // Provide a default locale if undefined
  if (!locale) {
    locale = 'fr';
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

