import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseInvoice, parseAndAddToInventory } from '../services/api';

export const useParseInvoice = () => {
  return useMutation({
    mutationFn: ({ text, imageBase64 }: { text?: string; imageBase64?: string }) =>
      parseInvoice(text, imageBase64),
  });
};

export const useParseAndAddToInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ text, imageBase64 }: { text?: string; imageBase64?: string }) =>
      parseAndAddToInventory(text, imageBase64),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};
