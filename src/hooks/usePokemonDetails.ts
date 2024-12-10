import { useState, useEffect } from "react";
import { pokeRepository } from "../services/pokeRepository";

export const usePokemonDetail = (name: string) => {
  const [pokemon, setPokemon] = useState<any>(null);
  const [description, setDescription] = useState<{ es: string; en: string }>({ es: '', en: '' });

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      const details = await pokeRepository.getPokemonDetails(name);
      const desc = await pokeRepository.getPokemonDescription(name);

      setPokemon(details);
      setDescription(desc);
    };

    fetchPokemonDetail();
  }, [name]);

  return { pokemon, description };
};