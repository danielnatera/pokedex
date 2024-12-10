"use client";

import Image from "next/image";
import SizeIcon from "../../assets/svg/size-icon.svg";
import WeightIcon from "../../assets/svg/weight-icon.svg";
import PokeballIcon from "../../assets/svg/pokeball-vector.svg";
import GenderIcon from "../../assets/svg/gender.svg";
import { PokemonDetails, Species, Translations } from "../../types/apiResponses";

export const AboutTab = ({   pokemon,
  species,
  translatedAbilities,
  description,
  translations,
}: {
  pokemon: PokemonDetails;
  species: Species | null;
  translatedAbilities: string[];
  description: string;
  translations: Translations;
}) => {
  const genderRate = species?.gender_rate ?? -1;
  const femalePercentage = genderRate === -1 ? 0 : genderRate * 12.5;
  const malePercentage = genderRate === -1 ? 0 : 100 - femalePercentage;
  const primaryType = pokemon.types[0].type.name;

  return (
    <div className="mt-4 flex flex-col items-center w-4/5">

      <div className="mt-4 grid grid-cols-2 gap-y-6 gap-x-8 bg-pokeBackground p-4 rounded-3xl w-full">
        
        {/* Height */}
        <div className="text-gray-700 font-medium flex gap-2 w-3/5">
          <Image src={SizeIcon} alt="Icono de Altura" width={20} height={20} />
          <span>{translations.height}</span>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-gray-800 w-full text-center">{(pokemon.height / 10).toFixed(1)} m</p>
        </div>

        {/* Weight */}
        <div className="text-gray-700 font-medium flex gap-2 w-3/5">
          <Image src={WeightIcon} alt="Icono de Peso" width={20} height={20} />
          <span>{translations.weight}</span>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-gray-800 w-full text-center">{(pokemon.weight / 10).toFixed(1)} kg</p>
        </div>

        {/* Abilities */}
        <div className="text-gray-700 font-medium flex gap-2 w-3/5">
          <Image src={PokeballIcon} alt="Icono de Habilidades" width={20} height={20} />
          <span>{translations.abilities}</span>
        </div>
        <div className="flex items-center gap-2 w-full text-center">
          <div className="text-gray-800 capitalize w-full text-center">{translatedAbilities.join(", ")}</div>
        </div>

        {/* Gender */}
        <div className="text-gray-700 font-medium flex gap-2 w-3/5">
          <Image src={GenderIcon} alt="Icono de Género" width={20} height={20} />
          <span>{translations.gender}</span>
        </div>
        <div className="flex items-center gap-2 w-full">
          {genderRate === -1 ? (
            <p className="text-gray-800 text-center w-full">{translations.no_gender}</p>
          ) : (
            <p className="text-gray-800 text-center w-full">
              ♂️ {malePercentage}% / ♀️ {femalePercentage}%
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-8">
        <h3 className={`text-lg font-bold text-${primaryType}`}>{translations.description}</h3>
        <p className="text-gray-700 bg-pokeBackground p-4 rounded-3xl">{description}</p>
      </div>
    </div>
  );
};