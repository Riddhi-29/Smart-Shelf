export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit?: string;
  expiry_date: string;
  category?: string;
  purchase_price?: number;
  selling_price?: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryItemCreate {
  name: string;
  quantity: number;
  unit?: string;
  expiry_date: string;
  category?: string;
  purchase_price?: number;
  selling_price?: number;
}

export interface InventoryItemUpdate {
  name?: string;
  quantity?: number;
  unit?: string;
  expiry_date?: string;
  category?: string;
  purchase_price?: number;
  selling_price?: number;
}

export interface ParsedItem {
  name: string;
  quantity: number;
  unit?: string;
  price?: number;
  confidence?: number;
}

export interface ParsedInvoice {
  items: ParsedItem[];
  vendor_name?: string;
  invoice_date?: string;
  total_amount?: number;
  raw_text?: string;
}

export interface FlashSaleItem {
  item_id: number;
  item_name: string;
  days_to_expiry: number;
  current_quantity: number;
  suggested_discount: number;
  reason: string;
}

export interface AlertSummary {
  low_stock_count: number;
  near_expiry_count: number;
  low_stock_items: InventoryItem[];
  near_expiry_items: InventoryItem[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
