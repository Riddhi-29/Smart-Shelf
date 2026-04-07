import axios from 'axios';
import type {
  InventoryItem,
  InventoryItemCreate,
  InventoryItemUpdate,
  ParsedInvoice,
  FlashSaleItem,
  AlertSummary,
  PaginatedResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inventory APIs
export const getInventory = async (
  page = 1,
  perPage = 20
): Promise<PaginatedResponse<InventoryItem>> => {
  const response = await api.get('/inventory', {
    params: { page, per_page: perPage },
  });
  return response.data;
};

export const getInventoryItem = async (id: number): Promise<InventoryItem> => {
  const response = await api.get(`/inventory/${id}`);
  return response.data;
};

export const createInventoryItem = async (
  item: InventoryItemCreate
): Promise<InventoryItem> => {
  const response = await api.post('/inventory', item);
  return response.data;
};

export const updateInventoryItem = async (
  id: number,
  item: InventoryItemUpdate
): Promise<InventoryItem> => {
  const response = await api.put(`/inventory/${id}`, item);
  return response.data;
};

export const deleteInventoryItem = async (id: number): Promise<void> => {
  await api.delete(`/inventory/${id}`);
};

// Alerts APIs
export const getAlertSummary = async (): Promise<AlertSummary> => {
  const response = await api.get('/alerts/summary');
  return response.data;
};

export const getLowStockItems = async (): Promise<InventoryItem[]> => {
  const response = await api.get('/alerts/low-stock');
  return response.data;
};

export const getNearExpiryItems = async (): Promise<InventoryItem[]> => {
  const response = await api.get('/alerts/near-expiry');
  return response.data;
};

// Invoice Parser APIs
export const parseInvoice = async (
  text?: string,
  imageBase64?: string
): Promise<ParsedInvoice> => {
  const response = await api.post('/invoice/parse', {
    text,
    image_base64: imageBase64,
  });
  return response.data;
};

export const parseAndAddToInventory = async (
  text?: string,
  imageBase64?: string
): Promise<InventoryItem[]> => {
  const response = await api.post('/invoice/parse-and-add', {
    text,
    image_base64: imageBase64,
  });
  return response.data;
};

// Flash Sale APIs
export const getFlashSaleSuggestions = async (): Promise<FlashSaleItem[]> => {
  const response = await api.get('/flash-sale/suggestions');
  return response.data;
};

export default api;
