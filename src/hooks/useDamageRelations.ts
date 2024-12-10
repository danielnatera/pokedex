import { useEffect, useState } from "react";
import { pokeRepository } from "../services/pokeRepository";

export const useDamageRelations = (pokemonTypes: { type: { name: string; url: string } }[]) => {
  const [damageRelations, setDamageRelations] = useState({
    weaknesses: [],
    strengths: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemonTypes) return;

    const fetchDamageRelations = async () => {
      try {
        setLoading(true);
        const damageRelations = await pokeRepository.getDamageRelations(pokemonTypes);
        setDamageRelations(damageRelations);
      } catch (error) {
        setError("Error al cargar las debilidades y fortalezas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDamageRelations();
  }, [pokemonTypes]);

  return { damageRelations, loading, error };
};