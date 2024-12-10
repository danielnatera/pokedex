import { useEffect, useState } from "react";
import { pokeRepository, evolutionService } from "../services/pokeRepository";
import { Pokemon } from "../types/apiResponses";

export const usePokemonList = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);

  useEffect(() => {
    const fetchPokemons = async () => {
      if (pokemons.length > 0) {
        setInitialLoadComplete(true); 
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Llamada a la API
        const data = await pokeRepository.getPokemonList(1200, 0);

        if (!data?.results) {
          throw new Error("La respuesta de la API no contiene la propiedad 'results'");
        }

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: Pokemon) => {
            try {
              const details = await pokeRepository.getPokemonDetails(pokemon.name);
              const species = await pokeRepository.getPokemonSpecies(pokemon.name);
              if (!species) {
                console.error(`❌ Error: species is null for Pokémon: ${pokemon.name}`);
                return null; // Retornamos null para ignorar Pokémon con error
              }

              // ✅ Asegúrate de acceder correctamente al nombre de la generación
              const generationName = species.generation?.name || "Desconocido";

              const evolutionChainId = species.evolution_chain.url.split("/").slice(-2, -1)[0];
              const evolutionChain = await evolutionService.getEvolutionChain(evolutionChainId);
              const evolutions = evolutionService.extractEvolutions(evolutionChain);

              return {
                name: details.name,
                url: pokemon.url,
                types: details.types.map((t: unknown) => t?.type?.name),
                generation: generationName, // ✅ Corrección aquí
                evolutions,
              };
            } catch (error) {
              console.error(`❌ Error loading details of Pokémon: ${pokemon.name}`, error);
              return null; // Retornamos null para ignorar Pokémon con error
            }
          })
        );

        const validPokemons = pokemonDetails.filter(Boolean) as Pokemon[];
        setPokemons(validPokemons);
      } catch (error) {
        console.error("❌ Error loading the list of Pokémon:", error);
        setError("An error occurred while loading the list of Pokémon.");
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    fetchPokemons();
  }, []);

  return {
    pokemons,
    loading,
    error,
    initialLoadComplete,
  };
};