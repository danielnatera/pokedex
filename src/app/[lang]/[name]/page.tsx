"use client";

import { useParams } from "next/navigation";
import { usePokemonDetail } from "../../../hooks/usePokemonDetails";
import { usePokemonSpecies } from "../../../hooks/usePokemonSpecies";
import { usePokemonAbilities } from "../../../hooks/usePokemonAbilities";
import { usePokemonEvolution } from "../../../hooks/usePokemonEvolutions";
import { useDamageRelations } from "../../../hooks/useDamageRelations";
import { useTranslatedTypes } from "../../../hooks/useTranslatedTypes";
import { useTranslations } from "../../../hooks/useTranslations";
import Image from "next/image";
import Link from "next/link";
import Pokeball from "../../../assets/svg/pokeball.svg";
import ArrowBack from "../../../assets/svg/arrow-back.svg";
import { useState } from "react";

import { AboutTab } from "../../../components/PokemonTabs/AboutTab";
import { StatsTab } from "../../../components/PokemonTabs/StatsTab";
import { EvolutionsTab } from "../../../components/PokemonTabs/EvolutionsTab";

export default function PokemonDetailPage() {
  const { name, lang } = useParams<{ name: string; lang: string }>();
  const { pokemon, description } = usePokemonDetail(name);
  const locale = lang || "es";
  const translations = useTranslations();

  const { species } = usePokemonSpecies(name);
  const { translatedAbilities } = usePokemonAbilities(
    pokemon?.abilities,
    locale as "es" | "en"
  );
  const { evolutionPairs } = usePokemonEvolution(name);
  const { damageRelations } = useDamageRelations(pokemon?.types);
  const { translatedTypes } = useTranslatedTypes(pokemon?.types, locale as "es" | "en");

  const [activeTab, setActiveTab] = useState("general");

  if (!pokemon) return <div>{translations.loading}</div>;

  const primaryType = pokemon.types[0].type.name;
  const primaryColor = `var(--${primaryType})`;
  const pokedexId = pokemon.id.toString().padStart(3, "0");

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        backgroundImage: `url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png')`,
        backgroundRepeat: "repeat",
        backgroundSize: "50px 50px",
        backgroundColor: primaryColor,
      }}
    >
      <div
        className="p-2 shadow-xl w-full md:w-2/5"
        style={{ backgroundColor: primaryColor }}
      >
        {/* Header */}
        <div className="relative mt-10 w-full">
          <Link
            href={`/${locale}`}
            className="absolute top-4 left-4 flex items-center z-20 gap-2"
          >
            <Image src={ArrowBack} alt="Back" width={24} height={24} />
            <h1 className="text-xl text-white font-bold capitalize z-20">
              {pokemon.name}
            </h1>
          </Link>
          <span className="absolute top-4 right-4 text-white text-sm font-bold z-10">
            #{pokedexId}
          </span>

          {/* Pokeball and pokemon sprite */}
          <div
            className="relative h-40 pt-10"
            style={{ backgroundColor: primaryColor }}
          >
            <Image
              src={Pokeball}
              alt="Pokeball"
              width={250}
              height={250}
              className="absolute -bottom-14 left-1/2 opacity-10 z-0"
            />
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
              <Image
                src={
                  pokemon.sprites.other["official-artwork"].front_default ||
                  pokemon.sprites.front_default
                }
                alt={pokemon.name}
                width={250}
                height={250}
                className="z-10"
              />
            </div>
          </div>
        </div>

        {/* Tabs container */}
        <div className="py-20 px-5 bg-white rounded-3xl flex flex-col items-center">
          <p className="text-sm text-gray-500 mt-2 capitalize text-center">
            {species?.generation.name
              .replace("generation-", translations.generation)
              .replace(/\b(i|ii|iii|iv|v|vi|vii|viii|ix|x)\b$/i, (roman) =>
                roman.toUpperCase()
              )}
          </p>

          <div className="flex justify-center gap-2 mt-4">
            {translatedTypes.map((type: { name: string; es: string; en: string }, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-white text-sm bg-${type.en}`}
              >
                {type[locale as keyof typeof type].charAt(0).toUpperCase() + type[locale as keyof typeof type].slice(1)}
              </span>
            ))}
          </div>

          <div className="flex justify-center mt-4 w-4/5">
            {["general", "stats", "evolutions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center py-2 font-semibold ${
                  activeTab === tab
                    ? "text-dark border-b-2 border-dark"
                    : "text-medium border-b-2 border-transparent"
                }`}
              >
                {translations[tab]}
              </button>
            ))}
          </div>

          {activeTab === "general" && (
            <AboutTab
              {...{
                pokemon,
                species,
                translations,
                description: description[locale as keyof typeof description],
                translatedAbilities,
              }}
            />
          )}

          {activeTab === "stats" && (
            <StatsTab
              {...{
                pokemon,
                damageRelations,
                translations,
                locale,
              }}
            />
          )}

          {activeTab === "evolutions" && (
            <EvolutionsTab
              {...{
                evolutionPairs,
                translations,
                locale,
                pokemon,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
