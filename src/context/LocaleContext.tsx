"use client";

import { createContext, useContext } from "react";

const LocaleContext = createContext<string | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};

export const LocaleProvider = ({ children, locale }: { children: React.ReactNode; locale: string }) => {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
};