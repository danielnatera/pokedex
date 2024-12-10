import { z } from 'zod';
import { 
  PokemonDetailsSchema, 
  PokemonTypeSchema, 
  AbilitySchema, 
  EvolutionChainSchema, 
  SpeciesSchema 
} from '../schemas/pokemonSchemas';

// Derivar los tipos de los esquemas de Zod
export type PokemonDetails = z.infer<typeof PokemonDetailsSchema>;
export type PokemonTypeDetail = z.infer<typeof PokemonTypeSchema>;
export type Ability = z.infer<typeof AbilitySchema>;
export type EvolutionChainNode = z.infer<typeof EvolutionChainSchema>;
export type Species = z.infer<typeof SpeciesSchema>;
export type PokemonType = z.infer<typeof PokemonTypeSchema>;

// Otros tipos
export interface ApiResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonDetails[];
}

export type EvolutionData = {
  name: string;
  sprite: string | null;
  trigger: string | null;
  minLevel: number | null;
  item: string | null;
  itemSprite: string | null;
  from: string | null;
};

export type TranslatedType = {
  name: string;
  es: string;
  en: string;
};

export type InputType = {
  name: string;
  url: string;
};


export interface EvolutionPokemon {
  name: string;
  sprite: string;
  itemSprite?: string | null;
  trigger?: string | null;
  minLevel?: number | null;
}

export interface EvolutionPair {
  from: EvolutionPokemon;
  to: EvolutionPokemon;
}

export interface Translations {
  level: string;
  unknown_method: string;
  no_evolution: string;
  [key: string]: string;
}

export type Evolution = {
  name: string;
  from: string | null;
  trigger: string | null;
  item: string | null;
  minLevel: number | null;
};

export interface Pokemon {
  stats: any;
  id: number;
  name: string;
  url: string;
  types: string[];
  generation: string;
  evolutions: Evolution[];
  height: number;
  weight: number;
  abilities: string[];
  sprite: string;
}  

export interface DamageRelations {
  weaknesses: Array<{
    en: string;
    es: string;
  }>;
  strengths: Array<{
    en: string;
    es: string;
  }>;
}