"use client";

import { PokemonDetails, DamageRelations, Translations } from "../../types/apiResponses";

export const StatsTab = ({
  pokemon,
  damageRelations,
  translations,
  locale,
}: {
  pokemon: PokemonDetails;
  damageRelations: DamageRelations;
  translations: Translations;
  locale: string;
}) => {
  const primaryType = pokemon.types[0].type.name;
  const primaryColor = `var(--${primaryType})`;
  return (
    <div className="mt-8 w-4/5 flex flex-col items-center justify-center">

      {/* Estadísticas base del Pokémon */}
      <ul className="space-y-3 w-full mt-4 bg-pokeBackground p-4 rounded-3xl">
        {pokemon.stats.map((stat: any) => (
          <li key={stat?.stat?.name} className="flex items-center">
            <span className="w-1/4 capitalize font-medium">
              {translations[stat?.stat?.name] || stat?.stat?.name}:
            </span>
            <span className="w-12 text-center">{stat.base_stat}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 ml-4 overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${stat.base_stat}%`,
                  backgroundColor: primaryColor,
                }}
              ></div>
            </div>
          </li>
        ))}
      </ul>

      {/* Weaknesses */}
      <div className="mt-8 w-full">
        {damageRelations.weaknesses.length > 0 && (
          <>
            <h2 className={`text-${primaryType} text-lg font-bold my-4 text-center`}>
              {translations.weaknesses}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {damageRelations.weaknesses.map((type, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 rounded-full text-white text-sm bg-${type.en}`}
                >
                  {type[locale as keyof typeof type].charAt(0).toUpperCase() + type[locale as keyof typeof type].slice(1)}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Strengths */}
      <div className="mt-8 w-full">
        {damageRelations.strengths.length > 0 && (
          <>
            <h2 className={`text-${primaryType} text-lg font-bold my-4 text-center`}>
              {translations.strengths}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {damageRelations.strengths.map((type, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 rounded-full text-white text-sm bg-${type.en}`}
                >
                  {type[locale as keyof typeof type].charAt(0).toUpperCase() + type[locale as keyof typeof type].slice(1)}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};