import { NextResponse } from 'next/server';

export function middleware(request) {
  // 🔥 Detect if accessing `/`
  if (request.nextUrl.pathname === '/') {
    // Get the preferred language from the browser
    const preferredLocale = request.headers.get('accept-language')?.split(',')[0].split('-')[0] || 'es';

    // Validate if the language is in the allowed list
    const supportedLocales = ['es', 'en'];
    const redirectLocale = supportedLocales.includes(preferredLocale) ? preferredLocale : 'es';

    // 🔥 Redirect to the URL with the detected language
    const url = new URL(`/${redirectLocale}`, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}