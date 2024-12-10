import { z } from "zod";

export const PokemonTypeSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(z.object({
    name: z.string(),
    url: z.string()
  }))
});

// ✅ Validate the details of a Pokémon type
export const PokemonTypeDetailSchema = z.object({
  names: z.array(
    z.object({
      language: z.object({ name: z.string() }),
      name: z.string(),
    })
  ),
});

// ✅ Validate the properties of a Pokémon ability
export const AbilitySchema = z.object({
  names: z.array(
    z.object({
      name: z.string(),
      language: z.object({
        name: z.string(),
      }),
    })
  ),
});

// ✅ Validate the details of a Pokémon
export const PokemonDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  abilities: z.array(
    z.object({
      ability: z.object({
        name: z.string(),
        url: z.string().url(),
      }),
      is_hidden: z.boolean(),
      slot: z.number(),
    })
  ),
  sprites: z.object({
    front_default: z.string().url().nullable(),
    other: z.object({
      "official-artwork": z.object({
        front_default: z.string().url().nullable(),
      }),
    }),
  }),
  types: z.array(
    z.object({
      slot: z.number(),
      type: z.object({
        name: z.string(),
        url: z.string().url(),
      }),
    })
  ),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      stat: z.object({
        name: z.string(),
      }),
    })
  ),
});


export const EvolutionDetailsSchema = z.object({
  trigger: z
    .object({
      name: z.string(),
    })
    .optional(),
  item: z
    .object({
      name: z.string(),
      url: z.string(),
    })
    .nullable()
    .optional(),
  min_level: z.number().nullable().optional(),
});

export const EvolutionChainNodeSchema: z.ZodType<unknown> = z.lazy(() =>
  z.object({
    species: z.object({
      name: z.string(),
      url: z.string(),
    }),
    evolves_to: z.array(EvolutionChainNodeSchema).optional(),
    evolution_details: z.array(EvolutionDetailsSchema).optional(),
  })
);

export const EvolutionChainSchema = z.object({
  chain: EvolutionChainNodeSchema,
});

export type EvolutionData = z.infer<typeof EvolutionChainSchema>;
// ✅ Validate the species of a Pokémon
export const SpeciesSchema = z.object({
  id: z.number(),
  baby_trigger_item: z
    .nullable(
      z
        .object({
          name: z.string(),
          url: z.string().url(),
        })
        .nullable()
    )
    .optional(),
  chain: EvolutionChainNodeSchema.optional(),
  flavor_text_entries: z
    .array(
      z.object({
        flavor_text: z.string(),
        language: z.object({
          name: z.string(),
        }),
      })
    )
    .optional(),
  evolution_chain: z.object({
    url: z.string().url(),
  }),
  generation: z.object({
    name: z.string(),
    url: z.string().url(),
  }),
  gender_rate: z.number(),
});

export const ItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  cost: z.number().nullable(),
  sprites: z
    .object({
      default: z.string().url().nullable(),
    })
    .nullable(),
  attributes: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .nullable(),
  effect_entries: z
    .array(
      z.object({
        effect: z.string(),
        short_effect: z.string(),
        language: z.object({
          name: z.string(),
          url: z.string(),
        }),
      })
    )
    .nullable(),
});

export const DamageRelationsSchema = z.object({
  double_damage_from: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
  double_damage_to: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
  half_damage_from: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
  half_damage_to: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
  no_damage_from: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
  no_damage_to: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
});

export const PokemonTypeResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  damage_relations: DamageRelationsSchema,
});

export type PokemonTypeResponse = z.infer<typeof PokemonTypeResponseSchema>;
