export type Product = {
  id: number;
  category: {
    id: number;
    name: string;
  };
  name: string;
  brand: string;
  warranty: string;
  price: string;
  temporal_price?: string;
  img: string;
  count?: number;
  categoria?: {
    id: number;
    name: string;
  };
  tiendaId?: string;
};
