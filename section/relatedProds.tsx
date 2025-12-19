import Card2 from "@/component/ui/card2";
import { useMemo } from "react";

interface Product {
  id: number;
  categoria?: {
    id: number;
    name: string;
  };
  name: string;
  brand: string;
  warranty: string;
  price: string;
  img: string;
  temporal_price?: string;
}

type RelatedProdsProps = {
  products?: Product[];
};

export default function RelatedProds({ products = [] }: RelatedProdsProps) {
  const visibleProducts = useMemo(() => products.slice(0, 6), [products]);

  if (visibleProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-10 px-5 xl:px-20">
      <div className="flex flex-col gap-1 mb-8">
        <p className="text-[20px] font-bold text-primary">También le puede interesar</p>
        <h2 className="text-[24px] font-bold text-accent">Productos relacionados</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleProducts.map((product) => (
          <Card2
            key={product.id}
            productId={product.id}
            category={product.categoria?.name}
            title={product.name}
            brand={product.brand}
            warranty={product.warranty}
            price={product.price}
            image={product.img}
            temporal_price={product?.temporal_price}
            position="horizontal"
          />
        ))}
      </div>
    </section>
  );
}
