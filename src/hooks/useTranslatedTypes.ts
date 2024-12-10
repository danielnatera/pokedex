import { useEffect, useState } from "react";
import { translationService } from "@/services/pokeRepository";

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

export const useTranslatedTypes = (types: PokemonType[] = [], locale: "es" | "en") => {
  const [translatedTypes, setTranslatedTypes] = useState<{ name: string; es: string; en: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!types.length) return;

    const fetchTranslatedTypes = async () => {
      try {
        setLoading(true);
        const typesToTranslate = types.map(({ type }) => ({
          name: type.name,
          url: type.url,
        }));

        const translated = await translationService.getTranslatedTypes(typesToTranslate);
        setTranslatedTypes(translated);
      } catch (error) {
        console.error("Error translating the types:", error);
        setError("Error translating the types");
      } finally {
        setLoading(false);
      }
    };

    fetchTranslatedTypes();
  }, [types, locale]);

  return { translatedTypes, loading, error };
};