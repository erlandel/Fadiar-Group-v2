export type OrderProduct = {
  name: string;
  brand: string;
  price: number;
  temporal_price?: number | string;
  currency?: {
    currency: string;
  };
  img: string;
  count: number;
}

export type Order = {
  id: string;
  date: string;
  time: string;
  client_ci: string;
  client_name?: string;
  client_last_names?: string;
  client_cell: string;
  client_cell2?: string;
  direccion: string;
  municipio_completo?: {
    municipio: string;
  };
  provincia_completa?: {
    provincia: string;
  };
  nota?: string;
  status: "En espera" | "Confirmado" | "Cancelado" | string;
  products: OrderProduct[];
}
