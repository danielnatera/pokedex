"use client";

import { useLocale } from "@/context/LocaleContext";

export const useTranslations = () => {
  const locale = useLocale();
  if (!locale) return {};
  try {
    const translations = require(`../../public/locales/${locale}/common.json`);
    return translations;
  } catch (error) {
    console.error(`❌ Error loading the translations for the language: ${locale}`, error);
    return {};
  }
};