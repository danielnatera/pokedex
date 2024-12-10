import Link from "next/link";
import Image from "next/image";
import { useParams } from 'next/navigation';
import { Pokemon } from '../types/apiResponses';

export const PokemonList = ({ pokemons }: { pokemons: Pokemon[] }) => {
  const params = useParams();
  const locale = params.lang || 'es';
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const translations = require(`../../public/locales/${locale}/common.json`);
  
  return (
    <div className="bg-primary min-h-[80vh] flex flex-col p-4">
      <div 
        className="border-18 rounded-lg bg-pokeBackground px-4 py-8 shadow-inner-strong w-full flex-1"  // Para que el borde inferior siempre esté visible
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {pokemons.map((pokemon) => {
            // Extract the ID from the Pokemon URL
            const id = pokemon.url.split("/").slice(-2, -1)[0];

            return (
              <Link
                href={`/${locale}/${pokemon.name}`}
                key={pokemon.name}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center relative"
              >
                {/* Image */}
                <div className="relative z-10 -mb-10">
                  <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                    alt={pokemon.name}
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                </div>
                {/* Pokedex number */}
                <span className="absolute top-2 right-2 text-medium text-sm font-bold px-2 py-1 rounded">
                  #{id}
                </span>
                {/* Information container */}
                <div className="bg-pokeBackground p-4 w-full rounded-lg shadow-inner relative z-0">
                  {/* Name */}
                  <h2 className="text-lg font-bold capitalize mt-4 text-medium">
                    {pokemon.name}
                  </h2>

                  {/* Types */}
                  <div className="flex gap-2 justify-center mt-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className={`px-2 py-1 text-xs font-medium rounded-full bg-${type} text-white`}
                      >
                        {translations[type] || type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    ))}
                  </div>

                  {/* Generation */}
                  <p className="text-sm text-gray-500 mt-2 capitalize">
                    {pokemon.generation
                      .replace("generation-", translations.generation)
                      .replace(
                        /\b(i|ii|iii|iv|v|vi|vii|viii|ix|x)\b$/i,
                        (roman) => roman.toUpperCase()
                      )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};