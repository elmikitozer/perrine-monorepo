import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default function RootPage() {
  // Get the Accept-Language header
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // Detect if the browser prefers French
  const prefersFrench = acceptLanguage.toLowerCase().includes('fr');
  
  // Redirect to the appropriate locale
  const locale = prefersFrench ? 'fr' : 'en';
  redirect(`/${locale}`);
}

