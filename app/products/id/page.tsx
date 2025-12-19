"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useMemo, useState, Suspense } from "react";
import { SectionMasRecientes } from "@/section/masRecientes";
import { SectionAbout4 } from "@/section/aboutUS/sectionAbout4";
import { server_url } from "@/lib/apiClient";
import { PackageX, Search, Home, ArrowLeft } from 'lucide-react';
import RelatedProds from "@/section/relatedProds";
import ShoppingCartIcon from "@/component/icons";
import useCartStore from "@/store/cartStore";
import { SearchParamsProvider } from "./SearchParamsProvider";

interface Product {
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



function ProductContent({ id }: { id: string | null }) {
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const addOrUpdateItem = useCartStore((state) => state.addOrUpdateItem);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    const sameCategory = allProducts.filter(
      (item) =>
        item.id !== product.id &&
        (item.categoria?.id || item.categoria?.name) === (product.categoria?.id || product.categoria?.name)
    );

    if (sameCategory.length >= 6) {
      return sameCategory.slice(0, 6);
    }

    const remaining = allProducts.filter((item) => item.id !== product.id && !sameCategory.includes(item));
    return [...sameCategory, ...remaining].slice(0, 6);
  }, [allProducts, product]);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo4NDAsImV4cCI6MTc2Mzg3NDg0NX0.-W2-13mCQ6L7x8MQ5KQCzuhK59ZpeqAOe6Vfo7TsThk';
        const res = await fetch(`${server_url}/inventory_manager`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setAllProducts(data.products);
        const foundProduct = data.products.find((p: Product) => p.id === parseInt(id as string));
        
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(foundProduct.img);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Interceptor local para animaciones de scroll
  useEffect(() => {
    if (isLoading || !product) return;

    const setupAnimations = () => {
      const elements = document.querySelectorAll<HTMLElement>('.animate-on-scroll:not(.animate__animated)');
      if (elements.length === 0) return;

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              const anim = el.dataset.animate || 'animate__fadeInUp';
              el.classList.add('aos-animate', 'animate__animated', anim);
              io.unobserve(el);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      elements.forEach(el => io.observe(el));
      return () => io.disconnect();
    };

    // Pequeño delay para asegurar que los componentes estén montados
    const timeout = setTimeout(setupAnimations, 50);
    return () => clearTimeout(timeout);
  }, [isLoading, product]);

  if (isLoading) {
    return (
      <main>
        <div className="px-4 md:px-20 2xl:px-36 mt-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-10"></div>
            <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/3 h-[400px] bg-gray-200 rounded-xl"></div>
              <div className="md:w-2/3 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="px-4 md:px-20 2xl:px-36 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icono */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50"></div>
              <div className="relative bg-white rounded-full p-6 shadow-lg">
                <PackageX className="w-16 h-16 text-red-600" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Título y descripción */}
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Producto no encontrado
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-md mx-auto">
            Lo sentimos, el producto que buscas no existe o ha sido removido de nuestro catálogo.
          </p>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver atrás
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors font-medium"
            >
              <Home className="w-5 h-5" />
              Ir al inicio
            </button>
          </div>

          {/* Sugerencias */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
              <Search className="w-5 h-5" />
              <span className="font-medium">Sugerencias</span>
            </div>
            <ul className="text-gray-600 space-y-2">
              <li>Verifica que la URL sea correcta</li>
              <li>Busca el producto en nuestro catálogo</li>
              <li>Contacta con soporte si necesitas ayuda</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
    );
  }

  const warrantyNumber = +(product.warranty ?? "0");
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
    };

    addOrUpdateItem(itemToAdd);
    console.log(`Added ${qty} x ${product.name} to cart`);
  };

  // Crear array de imágenes (usar la imagen principal y duplicarla para las miniaturas si no hay más)
  const images = [product.img, product.img, product.img];


  return (
    <main>
      <div className="px-4 md:px-20 2xl:px-36 mt-10">

        <div id={"list"} className="mt-10">
          <p className="text-xs text-gray-400 mb-4">
            <span className="text-gray-400">Home - </span>
            <span className="text-gray-400">Products - </span>
            <span className="text-primary font-semibold">{product.categoria?.name}</span>
          </p>
          <h1 className="text-3xl text-primary font-bold">Detalles del Producto</h1>
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
                    selectedImage === img ? 'border-blue-500' : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <Image
                    src={`${server_url}/${img}`}
                    alt={`thumb ${i + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 📌 INFORMACIÓN */}
          <div className="md:w-2/3">
            <p className="text-xs text-gray-500 mb-3">{product.categoria?.name || 'Sin categoría'}</p>
            <h2 className="text-3xl font-bold text-[#1A2B49]">{product.name}</h2>
            <p className="text-3xl text-[#022954] font-medium">{product.brand}</p>

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
                  <p className="text-3xl font-bold text-primary">${product.temporal_price} USD</p>
                  <p className="text-gray-400 line-through text-lg">${product.price} USD</p>
                </>
              ) : (
                <p className="text-3xl font-bold text-primary">${product.price} USD</p>
              )}
            </div>

            {/* Cantidad */}
            <div className="mt-auto pt-4 flex items-center justify-between">
              <div className="flex items-center rounded-xl border border-primary">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-yellow-500 hover:bg-gray-100 rounded-l-xl"
                >
                  −
                </button>
                <span className="px-4 my-1 border-x border-gray-300">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 text-yellow-500 hover:bg-gray-100 rounded-r-xl"
                >
                  +
                </button>
              </div>

               <button
                            className="rounded-xl border border-primary hover:bg-primary hover:text-white transition-colors py-2 px-4 2xl:py-2.5 2xl:px-6"
                            onClick={handleAddToCart}
                          >
                            <ShoppingCartIcon className="h-5 w-5" />
                          </button>
            </div>

            {/* Tabla de propiedades */}
            {product.specs && product.specs.length > 0 && (
              <div className="mt-8 bg-[#F5F7FA] rounded-xl p-5 border border-gray">
                <h3 className="font-semibold text-[#1A2B49] mb-3">Propiedades</h3>
                <table className="w-full text-sm text-gray-600">
                  <tbody>
                    {product.specs.map((p, i) => (
                      <tr key={i} className="border-b border-gray">
                        <td className="py-2 font-medium text-[#1E1E1E]">{p.name}</td>
                        <td className="py-2 text-right">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </div>
      <div className="mt-20">
        <RelatedProds products={relatedProducts} />
      </div>

      <div className="mt-20">
           <SectionAbout4/>       
      </div>
      <div>
          <SectionMasRecientes/>
        </div>
    </main>
  );
}

export default function Product() {
  return (
    <Suspense fallback={
      <main>
        <div className="px-4 md:px-20 2xl:px-36 mt-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-10"></div>
            <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/3 h-[400px] bg-gray-200 rounded-xl"></div>
              <div className="md:w-2/3 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    }>
      <SearchParamsProvider>
        {(id) => <ProductContent id={id} />}
      </SearchParamsProvider>
    </Suspense>
  );
}
