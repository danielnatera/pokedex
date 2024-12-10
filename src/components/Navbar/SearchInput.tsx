import { useSearchFilter } from "@/context/SearchFilterContext";
import { useTranslations } from "@/hooks/useTranslations";

export const SearchInput: React.FC = () => {
  const { searchQuery, setSearchQuery } = useSearchFilter();
  const translations = useTranslations();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full flex-1">
      <input
        type="text"
        value={searchQuery}
        placeholder={translations.search_pokemon}
        className="w-full px-4 py-2 text-black rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleSearchChange}
      />
    </div>
  );
};