import Image from "next/image";
import { useTranslations } from "@/hooks/useTranslations";

export const NotFound = () => {
  const translations = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg min-h-[80vh]">
      {/* Psyduck sprite */}
      <Image 
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png" 
        alt="Psyduck sprite" 
        width={96} 
        height={96} 
        className="mb-4"
      />
      
      {/* Error message */}
      <h2 className="text-lg font-bold text-gray-700">
        {translations.no_pokemon_found}
      </h2>
      
      <p className="text-gray-500 mt-2 text-center w-1/2">
        {translations.no_pokemon_found_description}
      </p>
    </div>
  );
};