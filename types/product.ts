export type Product = {
  id: string;
  name: string;
  brand: string;
  warranty: string;
  price: string;
  temporal_price?: string;
  img: string;
  count?: number;
  currency?: {
    currency: string;
  };
  categoria?: {
    id: string;
    name: string;
  };
  tiendaId?: string;
  id_tienda?: string;
};
