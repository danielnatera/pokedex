import { useQuery } from '@tanstack/react-query';
import { pokeRepository } from '../services/pokeRepository';

export const useFilters = () => {
  const { data: types, isLoading: loadingTypes, error: errorTypes } = useQuery({
    queryKey: ['pokemon-types'], 
    queryFn: pokeRepository.getPokemonTypes
  });

  const { data: generations, isLoading: loadingGenerations, error: errorGenerations } = useQuery({
    queryKey: ['pokemon-generations'], 
    queryFn: pokeRepository.getGenerations
  });

  return { types, generations, loadingTypes, loadingGenerations, errorTypes, errorGenerations };
};
