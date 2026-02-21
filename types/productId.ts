export type ProductID = {
  id: string;
  name: string;
  brand: string;
  warranty: string;
  price: string;
  temporal_price?: string;
  img: string;
  currency?: {
    currency: string;
  };
  categoria?: {
    id: string;
    name: string;
  };
  description?: string;
  tiendaId?: string;
  count?: number;
  specs?: Array<{ name: string; description: string }>;
}
