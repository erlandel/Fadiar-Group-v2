export type CardProps = {
  category?: string;
  title: string;
  brand: string;
  warranty?: string;
  price: string;
  image: string;
  count?: number;
  position?: "horizontal" | "vertical";
  maxWidthVertical?: string;
  quantityProducts?: number;
  temporal_price?: string;
  productId?: string;
  tiendaId?: string;
  fromBestSelling?: boolean;
  currency?: {
    currency: string;
  };
}
