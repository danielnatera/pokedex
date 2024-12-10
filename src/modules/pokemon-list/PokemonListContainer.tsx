"use client";

import { useState, useEffect } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { PokemonList } from "../../components/PokemonList";
import { pokeRepository, evolutionService } from "../../services/pokeRepository";
import { Pokemon } from "../../types/apiResponses";
import { usePokemonContext } from "../../context/PokemonContext";
import { useSearchFilter } from "../../context/SearchFilterContext"; 
import { NotFound } from "../../components/NotFound";

export default function PokemonListContainer() {
  const { pokemons, setPokemons } = usePokemonContext();
  const { searchQuery, filters, setSearchQuery, setFilters } = useSearchFilter(); 
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);

  // 🚀 **Verificar si hay algún filtro activo**
  const activeFilters = () => searchQuery !== "" || filters.type !== "" || filters.generation !== "";

  /**
   * 🔥 **Obtiene y configura la lista de Pokémon al cargar la página**
   */
  useEffect(() => {
    const fetchPokemons = async () => {
      if (pokemons.length > 0) {
        setFilteredPokemons(pokemons);
        setInitialLoadComplete(true);
        return;
      }

      try {
        setLoading(true);
        
        const data = await pokeRepository.getPokemonList(1200, 0);

        if (!data || !Array.isArray(data)) {
          throw new Error("The API did not return the list of Pokémon correctly.");
        }

        const pokemonDetails = await Promise.all(
          data.map(async (pokemon: { name: string; url: string }) => {
            try {
              const details = await pokeRepository.getPokemonDetails(pokemon.name);
              const species = await pokeRepository.getPokemonSpecies(pokemon.name);

              if (!species?.evolution_chain?.url) {
                console.warn(`⚠️ The Pokémon ${pokemon.name} does not have an evolution chain URL`);
                return null;
              }

              const evolutionChainId = species.evolution_chain.url.split("/").slice(-2, -1)[0];
              const evolutionChain = await evolutionService.getEvolutionChain(evolutionChainId);
              const evolutions = evolutionService.extractEvolutions(evolutionChain);

              return {
                name: details.name,
                url: pokemon.url,
                types: details.types.map((t: unknown) => t?.type?.name),
                generation: species.generation?.name ?? "unknown",
                evolutions,
              };
            } catch (error) {
              console.error(`❌ Error obtaining details of Pokémon ${pokemon.name}:`, error);
              return null;
            }
          })
        );

        const validPokemons = pokemonDetails.filter((pokemon): pokemon is Pokemon => !!pokemon);
        setPokemons(validPokemons);
        setFilteredPokemons(validPokemons);
      } catch (error) {
        console.error("❌ Error loading initial Pokémon:", error);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    fetchPokemons();
  }, [setPokemons]);

  /**
   * 🔥 **Aplica los filtros de búsqueda a la lista de Pokémon**
   */
  useEffect(() => {
    const filterResults = () => {
      if (!searchQuery && !filters.type && !filters.generation) {
        setFilteredPokemons(pokemons);
        return;
      }

      let results = [...pokemons];

      if (filters.type) {
        results = results.filter((pokemon) => 
          pokemon.types.some((type) => type === filters.type)
        );
        
      }

      if (filters.generation) {
        results = results.filter((pokemon) => pokemon.generation === filters.generation);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(
          (pokemon) =>
            pokemon.name.includes(query) ||
            pokemon.evolutions.some((evolution) => evolution.name.includes(query))
        );
      }

      setFilteredPokemons(results);
    };

    filterResults();
  }, [pokemons, filters, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleFilterChange = (newFilters: { type: string; generation: string }) => {
    setFilters(newFilters);
  };

  /**
   * 🔥 **Renderiza un esqueleto de carga**
   */
  const renderSkeletons = () => {
    const skeletons = Array.from({ length: 18 });
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10 mx-6">
        {skeletons.map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 rounded-lg shadow-md animate-pulse flex flex-col items-center text-center p-4"
          >
            <div className="bg-gray-300 h-24 w-24 rounded-full mb-4"></div>
            <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-pokeBackground rounded-lg">
      <Navbar onSearch={handleSearch} onFilterChange={handleFilterChange} />
      {loading ? (
        renderSkeletons()
      ) : filteredPokemons.length === 0 && initialLoadComplete && activeFilters() ? (
        <NotFound />
      ) : (
        <PokemonList pokemons={filteredPokemons} />
      )}
    </div>
  );
}
