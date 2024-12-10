// middleware.js

import { NextResponse } from 'next/server';

export function middleware(request) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;
  console.log('pathname', pathname)
  // 🔥 Ignore routes that don't require internationalization
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // 🔥 Detectar idioma preferido del usuario (obteniendo solo el código 'es', 'en'.)
  const acceptLanguage = request.headers.get('accept-language');
  const userPreferredLocale = acceptLanguage ? acceptLanguage.split(',')[0].split('-')[0] : 'es';

  // 🌐 If the URL is the root '/', redirect to the default or preferred language
  if (pathname === '/') {
    console.log('pathname vacio')
    return NextResponse.redirect(new URL(`/${userPreferredLocale}`, request.url));
  }

  // 🌐 If the URL doesn't have a language prefix (e.g., '/about' -> '/es/about')
  const supportedLocales = ['es', 'en']; // List of supported languages
  const currentLocale = pathname.split('/')[1]; // First segment of the URL (can be 'es', 'en', etc.)

  // 🔥 If the first segment of the URL is not a valid language, redirect
  if (!supportedLocales.includes(currentLocale)) {
    return NextResponse.redirect(new URL(`/${userPreferredLocale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 🔥 Define which routes should pass through this middleware
    '/((?!api|_next/static|_next/image|favicon.ico).*)', 
  ],
};
