"use client";

import { Logo } from "./Logo";
import { SearchInput } from "./SearchInput";
import { FilterMenu } from "./FilterMenu";

export const Navbar = () => {
  return (
    <nav className="bg-primary text-white p-4 shadow-lg flex flex-col items-center justify-between gap-4 w-full">
      <Logo />
      <div className="flex items-center space-between gap-2 w-full">
        <SearchInput />
        <FilterMenu />
      </div>
    </nav>
  );
};