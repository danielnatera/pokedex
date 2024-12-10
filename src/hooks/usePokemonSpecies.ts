import { useEffect, useState } from "react";
import { pokeRepository } from "../services/pokeRepository";
import { Species } from "../types/apiResponses";

export const usePokemonSpecies = (pokemonName: string) => {
  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemonName) return;

    const fetchSpecies = async () => {
      try {
        setLoading(true);
        const speciesData = await pokeRepository.getPokemonSpecies(pokemonName);
        setSpecies(speciesData);
      } catch (error) {
        setError("Error al cargar la especie");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [pokemonName]);

  return { species, loading, error };
};