"use client";

import PokemonListContainer from '@/modules/pokemon-list/PokemonListContainer';
export default function Home({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <div className="rounded-lg">
      <PokemonListContainer />
    </div>
  );
}