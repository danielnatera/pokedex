import { useEffect, useState } from "react";
import { pokeRepository, evolutionService } from "@/services/pokeRepository";
import { EvolutionData } from "@/types/apiResponses";

export const usePokemonEvolution = (name: string) => {
  const [evolutionChain, setEvolutionChain] = useState<EvolutionData[]>([]);
  const [evolutionPairs, setEvolutionPairs] = useState<Array<{ from: EvolutionData; to: EvolutionData }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;

    const fetchEvolutionChain = async () => {
      try {
        setLoading(true);
        const species = await pokeRepository.getPokemonSpecies(name);
        if (!species) throw new Error("Species not found");

        const evolutionChainUrl = species.evolution_chain.url;
        const evolutionChainId = evolutionChainUrl.split("/").slice(-2, -1)[0];
        const evolutionDetails = await evolutionService.getEvolutionChain(evolutionChainId);
        const extractedEvolutions = evolutionService.extractEvolutions(evolutionDetails);

        const evolutionData = await Promise.all(
          extractedEvolutions.map(async (evo) => {
            const pokemonData = await pokeRepository.getPokemonDetails(evo.name);
            let itemSprite: string | null = null;

            if (evo.item) {
              const itemData = await evolutionService.getItemDetails(evo.item);
              if (itemData?.sprites?.default) {
                itemSprite = itemData.sprites.default;
              }
            }

            return {
              name: evo.name,
              sprite: 
                pokemonData.sprites.front_default ||
                pokemonData.sprites.other["official-artwork"].front_default,
              trigger: evo.trigger || null,
              minLevel: evo.minLevel || null,
              item: evo.item || null,
              itemSprite: itemSprite || null,
              from: evo.from || null,
            };
          })
        );

        setEvolutionChain(evolutionData);

        const pairs = evolutionData.reduce<Array<{ from: EvolutionData; to: EvolutionData }>>((pairs, evo) => {
          if (evo.from) {
            const fromPokemon = evolutionData.find((p) => p.name === evo.from);
            if (fromPokemon) {
              pairs.push({ from: fromPokemon, to: evo });
            }
          }
          return pairs;
        }, []);

        setEvolutionPairs(pairs);
      } catch (error) {
        console.error("Error to obtain the evolution chain:", error);
        setError("Error to obtain the evolution chain.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvolutionChain();
  }, [name]);

  return { evolutionChain, evolutionPairs, loading, error };
};
