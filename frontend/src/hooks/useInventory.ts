import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../services/api';
import type { InventoryItemCreate, InventoryItemUpdate } from '../types';

export const useInventory = (page = 1, perPage = 20) => {
  return useQuery({
    queryKey: ['inventory', page, perPage],
    queryFn: () => getInventory(page, perPage),
  });
};

export const useInventoryItem = (id: number) => {
  return useQuery({
    queryKey: ['inventory', id],
    queryFn: () => getInventoryItem(id),
    enabled: !!id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: InventoryItemCreate) => createInventoryItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, item }: { id: number; item: InventoryItemUpdate }) =>
      updateInventoryItem(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};
