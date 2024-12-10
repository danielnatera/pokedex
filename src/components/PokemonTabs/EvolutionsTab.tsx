"use client";

import Link from "next/link";
import Image from "next/image";
import ArrowRight from "@/assets/svg/arrow-right.svg";
import { EvolutionPair, Translations, Pokemon } from "@/types/apiResponses";

export const EvolutionsTab = ({
  evolutionPairs,
  translations,
  locale,
  pokemon,
}: {
  evolutionPairs: EvolutionPair[];
  translations: Translations;
  locale: string;
  pokemon: Pokemon;
}) => {
  return (
    <div className="flex flex-col items-center mt-12 gap-8">
      {evolutionPairs.map((pair, index) => (
        <div key={index} className="flex items-center mb-4">
          {/* Pokémon origin */}
          <Link href={`/${locale}/${pair.from.name}`}>
            <div
              className={`flex flex-col items-center p-2 ${
                pair.from.name.toLowerCase() === pokemon.name.toLowerCase()
                  ? "border-2 border-dotted border-dark rounded-lg bg-pokeBackground"
                  : ""
              }`}
            >
              <Image
                src={pair.from.sprite}
                alt={pair.from.name}
                width={64}
                height={64}
                className="rounded-full"
              />
              <span className="text-sm capitalize mt-2">{pair.from.name}</span>
            </div>
          </Link>

          <div className="flex flex-col items-center mx-4 relative">
            <Image src={ArrowRight} alt="Flecha" width={32} height={32} />
            
            {pair.to.itemSprite ? (
              // Evolution item
              <Image
                src={pair.to.itemSprite}
                alt="Ítem de evolución"
                width={32}
                height={32}
                className="mt-1"
              />
            ) : (
              // Evolution condition
              <div className="relative flex flex-col items-center justify-center mt-2">
                {pair.to.trigger === "level-up" ? (
                  <span className="text-xs text-gray-500 mt-1">
                    {translations.level} {pair.to.minLevel || "?"}
                  </span>
                ) : pair.to.trigger ? (
                  <span className="text-xs text-gray-500 mt-1">
                    {translations[pair.to.trigger] || pair.to.trigger}
                  </span>
                ) : (
                  <>
                    <span className="text-gray-500 text-xs font-bold mt-1 mr-1">
                      ?
                    </span>
                    <div className="relative group">
                      <span className="text-gray-500 text-xs font-bold cursor-pointer">
                        ❓
                      </span>
                      <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 p-2 w-32 text-center bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {translations.unknown_method}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Pokémon next evolution */}
          <Link href={`/${locale}/${pair.to.name}`}>
            <div
              className={`flex flex-col items-center ${
                pair.to.name.toLowerCase() === pokemon.name.toLowerCase()
                  ? "border-2 border-dotted border-dark rounded-lg bg-pokeBackground p-2"
                  : ""
              }`}
            >
              <Image
                src={pair.to.sprite}
                alt={pair.to.name}
                width={64}
                height={64}
                className="rounded-full"
              />
              <span className="text-sm capitalize mt-2">{pair.to.name}</span>
            </div>
          </Link>
        </div>
      ))}

      {evolutionPairs.length === 0 && (
        <p className="text-sm text-gray-600 mt-4 flex flex-col items-center">
          {translations.no_evolution}
        </p>
      )}
    </div>
  );
};
