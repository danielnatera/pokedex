import axios, { AxiosError } from "axios";
import {
  PokemonDetailsSchema,
  SpeciesSchema,
  AbilitySchema,
  PokemonTypeSchema,
  PokemonTypeDetailSchema,
  EvolutionChainSchema,
  ItemSchema,
  PokemonTypeResponse,
  PokemonTypeResponseSchema,
  EvolutionChainNodeSchema,
} from "../schemas/pokemonSchemas";
import { EvolutionData, InputType, TranslatedType } from "../types/apiResponses";
import { z } from "zod";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 10000, // Prevents requests from hanging
});

// 🔥 **Section 1: Translation Services**
export const translationService = {
  /**
   * Obtain the translation of a type in spanish.
   * @param typeUrl URL of the type in the PokeAPI
   * @returns Name of the type in spanish
   */
  async getTypeInSpanish(typeUrl: string): Promise<string> {
    try {
      const response = await api.get(typeUrl);
      const result = PokemonTypeSchema.parse(response.data);
      const spanishName = result.names.find(
        (entry) => entry.language.name === "es"
      );
      return spanishName ? spanishName.name : "Sin traducción";
    } catch (error) {
      console.error("❌ Error to translate type:", error);
      return "Error to load type";
    }
  },

  /**
   * Obtain the translation of an ability in spanish.
   * @param abilityUrl URL of the ability in the PokeAPI
   * @returns Name of the ability in spanish
   */
  async getAbilityTranslation(
    abilities: Array<{ ability: { name: string; url: string } }>
  ) {
    try {
      // Use Promise.all to make all requests at the same time
      const abilityTranslations = await Promise.all(
        abilities.map(async (abilityObj) => {
          try {
            const response = await api.get(abilityObj.ability.url);
            const result = AbilitySchema.parse(response.data);

            // 🔥 Extract names in spanish and english
            const spanishEntry = result.names.find(
              (entry) => entry.language.name === "es"
            );
            const englishEntry = result.names.find(
              (entry) => entry.language.name === "en"
            );

            return {
              name: abilityObj.ability.name, // Original ability name
              es: spanishEntry ? spanishEntry.name : "Sin traducción",
              en: englishEntry ? englishEntry.name : "No translation",
            };
          } catch (error) {
            console.error(
              `❌ Error al obtener habilidad para ${abilityObj.ability.name}:`,
              error
            );
            return {
              name: abilityObj.ability.name,
              es: "Error al cargar habilidad",
              en: "Error loading ability",
            };
          }
        })
      );

      return abilityTranslations;
    } catch (error) {
      console.error("❌ Error to obtain ability translations:", error);
      return [];
    }
  },

  async getTranslatedTypes(types: InputType[]): Promise<TranslatedType[]> {
    try {

      const typeTranslations: TranslatedType[] = await Promise.all(
        types.map(async (type) => {
          try {
            const response = await axios.get(type.url);

            const result = PokemonTypeDetailSchema.parse(response.data);

            const spanishName = result.names.find(
              (entry) => entry.language.name === "es"
            );
            const englishName = result.names.find(
              (entry) => entry.language.name === "en"
            );

            return {
              name: type.name, 
              es: spanishName ? spanishName.name.toLowerCase() : "Sin traducción",
              en: englishName ? englishName.name.toLowerCase() : "No translation",
            };
          } catch (error) {
            console.error(`❌ Error to translate the type ${type.name}:`, error);
            return {
              name: type.name,
              es: "Error al cargar tipo",
              en: "Error loading type",
            };
          }
        })
      );

      return typeTranslations;
    } catch (error) {
      console.error("❌ Error to obtain the type translations:", error);
      return [];
    }
  },
  
};

// 🔥 **Section 2: Pokemon Repository**
export const pokeRepository = {
  /**
   * Obtain the list of Pokémon.
   * @param limit Amount of Pokémon to obtain
   * @param offset From where to start the list
   * @returns List of Pokémon
   */
  async getPokemonList(limit: number, offset: number) {
    try {
      const response = await api.get(
        `/pokemon?limit=${limit}&offset=${offset}`
      );
      return response.data.results;
    } catch (error) {
      console.error("❌ Error to obtain the list of Pokémon:", error);
      return [];
    }
  },

  async getPokemonTypes() {
    try {
      const response = await api.get("/type");

      // 🔥 Validate the response with Zod
      const parsedData = PokemonTypeSchema.parse(response.data);

      // 🔥 Extract and return the names of the Pokémon types
      return parsedData.results.map((type) => type.name);
    } catch (error) {
      console.error("❌ Error to obtain the Pokémon types:", error);
      return [];
    }
  },

  async getGenerations() {
    try {
      const response = await api.get("/generation");
      return response.data.results.map((gen: { name: string }) => gen.name);
    } catch (error) {
      console.error("❌ Error to obtain the Pokémon generations:", error);
      return [];
    }
  },
  /**
   * Obtain the details of a Pokémon.
   * @param name Name or ID of the Pokémon
   * @returns Details of the Pokémon
   */
  async getPokemonDetails(name: string) {
    try {
      const response = await api.get(`/pokemon/${name}`);
      const result = PokemonDetailsSchema.parse(response.data); // ✅ Validate the response
      return result;
    } catch (error) {
      console.error(`❌ Error to obtain details of ${name}:`, error);
      throw new Error("Error to obtain the Pokémon details.");
    }
  },

  // 🔥 **Update function in the pokeRepository**
  async getPokemonSpecies(name: string) {
    try {
      const response = await api.get(`/pokemon-species/${name}`);
      const result = SpeciesSchema.parse(response.data);
      return result;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 404) {
          console.warn(`⚠️ Pokémon species not found: ${name}`);
          return null; // Return null or a default object
        }
      } else if (error instanceof z.ZodError) {
        console.error(`❌ Validation error obtaining the species of Pokémon:`, error);
      } else if (error instanceof Error) {
        console.error(`❌ Unknown error retrieving the Pokémon species (${name}):`, error.message);
      } else {
        console.error(`❌ Unknown error (unknown type) retrieving the Pokémon species (${name}):`, error);
      }
      throw new Error("Error retrieving the Pokémon species.");
    }
  },
  
  async getPokemonDescription(name: string) {
    try {
      const species = await this.getPokemonSpecies(name);
  
      if (!species || !species.flavor_text_entries) {
        console.warn(`⚠️ Text entries not found for the species: ${name}`);
        return {
          es: "No description available in spanish.",
          en: "No description available in english.",
        };
      }
  
      const flavorTextEntryEs = species.flavor_text_entries.find(
        (entry) => entry.language.name === "es"
      );
      const flavorTextEntryEn = species.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );
  
      const descriptionEs = flavorTextEntryEs 
        ? flavorTextEntryEs.flavor_text.replace(/\n|\f/g, " ") 
        : "No description available in spanish.";
  
      const descriptionEn = flavorTextEntryEn 
        ? flavorTextEntryEn.flavor_text.replace(/\n|\f/g, " ") 
        : "No description available in english.";
  
      return { 
        es: descriptionEs, 
        en: descriptionEn 
      };
  
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.warn(`⚠️ Pokémon species not found: ${name}`);
        return null; 
      }
      console.error(`❌ Error retrieving the Pokémon description:`, error);
      return { 
        es: "Failed to retrieve the Pokémon description.", 
        en: "Failed to retrieve the Pokémon description." 
      };
    }
  },

  async getDamageRelations(
    pokemonTypes: { type: { name: string; url: string } }[]
  ) {
    try {
      // 🔥 Call the API for each Pokémon type (use the URL directly)
      const typeRequests = await Promise.all(
        pokemonTypes.map((typeInfo) => axios.get(typeInfo.type.url))
      );
      const typeResponses = typeRequests.map((res) => {
        // 🔥 Validate the response of each type with Zod
        const result = PokemonTypeResponseSchema.parse(res.data);
        return result;
      });
  
      const weaknesses: { name: string; url: string }[] = [];
      const strengths: { name: string; url: string }[] = [];
  
      // 🔥 Extract weaknesses and strengths from the API response
      typeResponses.forEach((type: PokemonTypeResponse) => {
        type.damage_relations.double_damage_from.forEach(({ name, url }: { name: string; url: string }) => {
          if (name && url) weaknesses.push({ name, url });
        });
        type.damage_relations.double_damage_to.forEach(({ name, url }: { name: string; url: string }) => {
          if (name && url) strengths.push({ name, url });
        });
      });
  
      // 🔥 Translate the types of weaknesses and strengths
      const translatedWeaknesses = await translationService.getTranslatedTypes(weaknesses);
      const translatedStrengths = await translationService.getTranslatedTypes(strengths);
  
      return {
        weaknesses: translatedWeaknesses,
        strengths: translatedStrengths,
      };
    } catch (error) {
      console.error(
        "❌ Error to obtain the weaknesses and strengths of the types:",
        error
      );
      return {
        weaknesses: ["Error to load weaknesses"],
        strengths: ["Error to load strengths"],
      };
    }
  },
};

// 🔥 **Section 3: Evolution Service**
export const evolutionService = {
  async getEvolutionChain(id: number | string): Promise<EvolutionData> {
    try {
      const response = await api.get(`/evolution-chain/${id}`);
      const result = EvolutionChainSchema.parse(response.data);
      return result;
    } catch (error) {
      console.error("❌ Error to obtain the evolution chain:", error);
      throw new Error("Error to obtain the evolution chain.");
    }
  },

  extractEvolutions(evolutionChain: EvolutionData) {
    const evolutions: Array<{
      name: string;
      from: string | null;
      trigger: string | null;
      item: string | null;
      minLevel: number | null;
    }> = [];
  
    const traverse = (node: z.infer<typeof EvolutionChainNodeSchema>, from: string | null = null) => {
      if (!node || !node.species) {
        console.warn("⚠️ Invalid node:", node);
        return;
      }
  
      const evolutionDetails = node.evolution_details?.[0] || {};
      evolutions.push({
        name: node.species.name,
        from: from,
        trigger: evolutionDetails.trigger?.name || null,
        item: evolutionDetails.item?.name || null,
        minLevel: evolutionDetails.min_level || null,
      });
  
      if (Array.isArray(node.evolves_to) && node.evolves_to.length > 0) {
        node.evolves_to.forEach((evo) => traverse(evo, node.species.name));
      }
    };
  
    traverse(evolutionChain.chain);
    return evolutions;
  },  

  async getEvolutionDetails(url: string) {
    const response = await api.get(url);
    const evolutionChain = response.data.chain;
    return this.extractEvolutions(evolutionChain);
  },

  async getItemDetails(name: string) {
    try {
      // 🌐 Call the PokeAPI
      const response = await api.get(`/item/${name}`);
      const result = ItemSchema.parse(response.data); // Validate the data with Zod
      return result;
    } catch (error) {
      // ⚠️ If the item is not found (404), show a warning
      if (error instanceof AxiosError && error.response && error.response.status === 404) {
        console.warn(`⚠️ Pokémon item not found: ${name}`);
        return null; // Return null to indicate that the item was not found
      }
      // ❌ If an unexpected error occurs, throw an exception
      console.error(`❌ Error retrieving the Pokémon item (${name}):`, error);
      throw new Error("Error retrieving the Pokémon item.");
    }
  },
  
};
