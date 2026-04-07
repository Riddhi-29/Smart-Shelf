import { useQuery } from '@tanstack/react-query';
import { getFlashSaleSuggestions } from '../services/api';

export const useFlashSaleSuggestions = () => {
  return useQuery({
    queryKey: ['flash-sale', 'suggestions'],
    queryFn: getFlashSaleSuggestions,
    refetchInterval: 60000,
  });
};
