export type Item = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  unit: string;
  unit_price: string;
  category: string | null;
  created_at: string;
  updated_at: string;
};

export type ItemCreate = {
  sku: string;
  name: string;
  description?: string | null;
  unit?: string;
  unit_price?: string;
  category?: string | null;
};
