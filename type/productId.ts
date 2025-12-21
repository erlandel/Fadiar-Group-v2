
export type ProductID = {
  id: number;
  name: string;
  brand: string;
  warranty: string;
  price: string;
  temporal_price?: string;
  img: string;
  categoria?: {
    id: number;
    name: string;
  };
  description?: string;
  specs?: Array<{ name: string; description: string }>;
}