import { useQuery } from '@tanstack/react-query';
import {
  getAlertSummary,
  getLowStockItems,
  getNearExpiryItems,
} from '../services/api';

export const useAlertSummary = () => {
  return useQuery({
    queryKey: ['alerts', 'summary'],
    queryFn: getAlertSummary,
    refetchInterval: 30000,
  });
};

export const useLowStockItems = () => {
  return useQuery({
    queryKey: ['alerts', 'low-stock'],
    queryFn: getLowStockItems,
  });
};

export const useNearExpiryItems = () => {
  return useQuery({
    queryKey: ['alerts', 'near-expiry'],
    queryFn: getNearExpiryItems,
  });
};
