import { useFilters } from "@/hooks/useFilters";
import { useSearchFilter } from "@/context/SearchFilterContext";
import { useTranslations } from "@/hooks/useTranslations";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Image from "next/image";
import { useEffect, useState } from "react";
import Menu from "../../assets/svg/sort.svg";

export const FilterMenu: React.FC = () => {
  const { filters, setFilters } = useSearchFilter();
  const { types, generations } = useFilters();
  const translations = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, type: e.target.value });
  };

  const handleGenerationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, generation: e.target.value });
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const isClickInsideMenu = target.closest("#filter-menu");
    const isClickOnButton = target.closest("#filter-button");
  
    if (!isClickInsideMenu && !isClickOnButton) {
      setIsMenuOpen(false);
    }
  };
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isClickInsideMenu = target.closest("#filter-menu");
      const isClickOnButton = target.closest("#filter-button");
      
      if (!isClickInsideMenu && !isClickOnButton) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative z-20">
      <button
        id="filter-button"
        onClick={toggleMenu}
        className="bg-white text-black px-3 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Image src={Menu} alt="Filter" width={20} height={20} />
      </button>

      {isMenuOpen && (
        <div id="filter-menu" className="absolute right-0 mt-2 w-64 bg-primary text-black rounded-md z-10">
          <div className="p-4 bg-primary rounded-lg shadow-inner-strong">
            <label className="block font-bold text-white text-sm mb-1">
              {translations.type}
            </label>
            <select
              value={filters.type}
              onChange={handleTypeChange}
              className="w-full bg-gray-100 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{translations.all_types}</option>
              {types?.map((type) => (
                <option key={type} value={type}>
                  {translations[type] || type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            <label className="block font-bold text-white text-sm mt-4 mb-1">
              {translations.generation}
            </label>
            <select
              value={filters.generation}
              onChange={handleGenerationChange}
              className="w-full bg-gray-100 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{translations.all_generations}</option>
              {generations?.map((generation: string) => (
              <option key={generation} value={generation}>
                {generation
                  .replace("generation-", translations.generation)
                  .replace(
                    /\b(i|ii|iii|iv|v|vi|vii|viii|ix|x)\b$/i,
                    (roman: string) => roman.toUpperCase()
                  )}
                </option>
              ))}
            </select>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </div>
  );
};