"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, Suspense } from "react";
import { SectionAbout4 } from "@/section/aboutUS/sectionAbout4";
import { server_url } from "@/lib/apiClient";
import ShoppingCartIcon from "@/component/icons";
import { useAddToCart } from "@/hooks/useAddToCart";
import { SearchParamsProvider } from "./SearchParamsProvider";
import { LatestProducts } from "@/section/latestProducts";
import ProductLoadingId from "@/component/productLoadingId/productLoadingId";
import { ProductID } from "@/types/productId";
import RelatedProds from "@/section/relatedProds";
import { BestSelling } from "@/section/bestSelling/bestSelling";
import useProductsByLocationStore from "@/store/productsByLocationStore";

function ProductContent({ id }: { id: string | null }) {
  const { municipalityId } = useProductsByLocationStore();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState<ProductID | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [allProducts, setAllProducts] = useState<ProductID[]>([]);
  const { addToCart, loading } = useAddToCart();

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    const sameCategory = allProducts.filter(
      (item) =>
        item.id !== product.id &&
        (item.categoria?.id || item.categoria?.name) ===
          (product.categoria?.id || product.categoria?.name)
    );

    if (sameCategory.length >= 6) {
      return sameCategory.slice(0, 6);
    }

    const remaining = allProducts.filter(
      (item) => item.id !== product.id && !sameCategory.includes(item)
    );
    return [...sameCategory, ...remaining].slice(0, 6);
  }, [allProducts, product]);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);

      try {
        const queryParams = new URLSearchParams();
        queryParams.append("productos", "true");
        if (municipalityId) {
          queryParams.append("municipio", municipalityId.toString());
        }

        const res = await fetch(`${server_url}/inventory_manager?${queryParams.toString()}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        const products = data.tiendas?.flatMap((tienda: any) => 
          (tienda.productos || []).map((p: any) => ({ ...p, tiendaId: tienda.id }))
        ) || [];
        setAllProducts(products);
        const foundProduct = products.find(
          (p: ProductID) => p.id === parseInt(id as string)
        );

        if (foundProduct) {
          console.log("foundProduct ", foundProduct);
          setProduct(foundProduct);
          setSelectedImage(foundProduct.img);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, municipalityId]);



  const warrantyNumber = product ? Number(product.warranty ?? 0) : 0;
  const warrantyMonths = warrantyNumber > 0 ? warrantyNumber / 30 : 0;

  const handleAddToCart = () => {
    if (!product) return;

    const itemToAdd = {
      productId: product.id,
      title: product.name,
      brand: product.brand,
      category: product.categoria?.name,
      warranty: product.warranty,
      price: product.price,
      temporal_price: product.temporal_price,
      image: product.img,
      quantity: qty,
      tiendaId: product.tiendaId,
    };

    addToCart(itemToAdd);
    console.log(`Added ${qty} x ${product.name} to cart`);
  };

  // Crear array de imágenes (usar la imagen principal y duplicarla para las miniaturas si no hay más)
  const images = product ? [product.img, product.img, product.img] : [];

  return (
    <main>
      <div className="px-4 md:px-20 2xl:px-36 mt-10">
        {isLoading ? (
          <ProductLoadingId />
        ) : !product ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-primary mb-4">
                Producto no encontrado
              </h1>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all"
              >
                Volver atrás
              </button>
            </div>
          </div>
        ) : (
          <>
            <div id={"list"} className="mt-10">
              <p className="text-xs text-gray-400 mb-4">
                <span className="text-gray-400">Home - </span>
                <span className="text-gray-400">Products - </span>
                <span className="text-primary font-semibold">
                  {product.categoria?.name}
                </span>
              </p>
              <h1 className="text-3xl text-primary font-bold">
                Detalles del Producto
              </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-16 mt-10">
              <div className="md:w-1/3">
                {/* Imagen Principal */}
                <div className="w-full h-[400px] rounded-xl object-cover overflow-hidden">
                  <Image
                    src={`${server_url}/${selectedImage || product.img}`}
                    alt={product.name}
                    width={613}
                    height={682}
                    unoptimized
                    className="w-full h-full rounded-xl object-contain"
                  />
                </div>

                {/* Miniaturas */}
                <div className="flex gap-2 mt-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 rounded-md border-2 cursor-pointer overflow-hidden transition-all ${
                        selectedImage === img
                          ? "border-blue-500"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      <Image
                        src={`${server_url}/${img}`}
                        alt={`thumb ${i + 1}`}
                        width={80}
                        height={80}
                        unoptimized
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 📌 INFORMACIÓN */}
              <div className="md:w-2/3">
                <p className="text-xs text-gray-500 mb-3">
                  {product.categoria?.name || "Sin categoría"}
                </p>
                <h2 className="text-3xl font-bold text-[#1A2B49]">
                  {product.name}
                </h2>
                <p className="text-3xl text-[#022954] font-medium">
                  {product.brand}
                </p>

                {/* Descripción */}
                {product.description && (
                  <p className="text-[#1E1E1E] text-sm mt-3 max-w-xl leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Garantía */}
                {warrantyMonths > 0 && (
                  <p className="text-yellow-500 font-semibold text-md mt-2">
                    Garantía de {warrantyMonths} meses
                  </p>
                )}

                {/* Precios */}
                <div className="mt-3 flex items-center gap-4">
                  {product.temporal_price ? (
                    <>
                      <p className="text-3xl font-bold text-primary">
                        ${product.temporal_price} USD
                      </p>
                      <p className="text-gray-400 line-through text-lg">
                        ${product.price} USD
                      </p>
                    </>
                  ) : (
                    <p className="text-3xl font-bold text-primary">
                      ${product.price} USD
                    </p>
                  )}
                </div>

                {/* Cantidad */}
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center rounded-xl border border-primary font-bold">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-5 py-3 text-yellow-500 hover:bg-gray-100 rounded-l-xl"
                    >
                      −
                    </button>
                    <span className="px-4 my-1 border-x border-gray-300">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="px-5 py-3 text-yellow-500 hover:bg-gray-100 rounded-r-xl"
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="rounded-xl border border-primary hover:bg-primary hover:text-white transition-colors px-10 py-3"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Tabla de propiedades */}
                {product.specs && product.specs.length > 0 && (
                  <div className="mt-8 bg-[#F5F7FA] rounded-xl p-5 border border-gray">
                    <h3 className="font-semibold text-[#1A2B49] mb-3">
                      Propiedades
                    </h3>
                    <table className="w-full text-sm text-gray-600 table-fixed">
                      <tbody>
                        {product.specs.map((p, i) => (
                          <tr key={i} className="border-b border-gray">
                            <td className="py-2 sm:font-medium text-[#1E1E1E] text-sm sm:text-base wrap-break-word max-w-[50%]">
                              {p.name}
                            </td>
                            <td className="py-2 text-right text-sm sm:text-base wrap-break-word max-w-[50%] whitespace-normal">
                              {p.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-20">
        <RelatedProds products={relatedProducts} />
      </div>

      <div className="mt-20">
        <SectionAbout4 />
      </div>

      <div className="hidden xl:block">
        <LatestProducts />
      </div>

      <div className="xl:hidden">
        <BestSelling />
      </div>
    </main>
  );
}

export default function Product() {
  return (
    <Suspense>
      <SearchParamsProvider>
        {(id) => <ProductContent id={id} />}
      </SearchParamsProvider>
    </Suspense>
  );
}
