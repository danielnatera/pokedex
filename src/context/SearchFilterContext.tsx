"use client";

import React, { createContext, useContext, useState } from "react";

interface SearchFilterContextType {
  searchQuery: string;
  filters: { type: string; generation: string };
  setSearchQuery: (query: string) => void;
  setFilters: (filters: { type: string; generation: string }) => void;
}

const SearchFilterContext = createContext<SearchFilterContextType | undefined>(undefined);

export const SearchFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<{ type: string; generation: string }>({ type: "", generation: "" });

  return (
    <SearchFilterContext.Provider value={{ searchQuery, filters, setSearchQuery, setFilters }}>
      {children}
    </SearchFilterContext.Provider>
  );
};

export const useSearchFilter = (): SearchFilterContextType => {
  const context = useContext(SearchFilterContext);
  if (!context) {
    throw new Error("useSearchFilter must be used within a SearchFilterProvider");
  }
  return context;
};
