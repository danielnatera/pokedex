import { useEffect, useState } from "react";
import { translationService } from "../services/pokeRepository";

export const usePokemonAbilities = (abilities: Array<{ ability: { name: string; url: string } }>, locale: "es" | "en") => {
  const [translatedAbilities, setTranslatedAbilities] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!abilities) return;

    const fetchAbilitiesInSpanish = async () => {
      try {
        setLoading(true);
        const translatedAbilities = await translationService.getAbilityTranslation(abilities);
        const formattedAbilities = translatedAbilities.map(
          (ability) => ability[locale]
        );
        setTranslatedAbilities(formattedAbilities);
      } catch (error) {
        setError("Error al cargar habilidades", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbilitiesInSpanish();
  }, [abilities, locale]);

  return { translatedAbilities, loading, error };
};