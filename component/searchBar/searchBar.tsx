"use client";
import { IcSharpSearch } from "@/icons/icons";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { server_url } from "@/lib/apiClient";
import { Product } from "@/type/product";



export default function Serchbar() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch all products on component mount
  useEffect(() => {
    const getAllProducts = async () => {
      setIsLoading(true);
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo4NDAsImV4cCI6MTc2Mzg3NDg0NX0.-W2-13mCQ6L7x8MQ5KQCzuhK59ZpeqAOe6Vfo7TsThk';
        const res = await fetch(`${server_url}/inventory_manager`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          next: { 
            revalidate: 300
          },
          cache: 'force-cache'
        });

        const data = await res.json();
        setAllProducts(data.products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getAllProducts();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim() === "") {
      setSearchResults([]);
      setIsOpen(false);
    } else {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.brand.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
      setIsOpen(true);
    }
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      <div>
        <div className="flex justify-center w-full  lg:w-160  ">
          <div ref={searchRef} className="relative w-full  md:min-w-120  lg:max-w-160">
            <input
              type="text"
              placeholder="Buscar producto"
              value={query}
              onChange={handleSearch}
              onFocus={() => query && setIsOpen(true)}
              className="w-full outline-none text-base text-black placeholder-gray-400 bg-transparent px-4 pb-1 border-b border-[#022954]"
            />
            <button className="absolute right-3 top-0 cursor-pointer">
              <IcSharpSearch className="w-7 h-7 text-gray-800" />
            </button>
            
            {isOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="p-3 text-gray-500 text-sm">
                    Buscando productos...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={`${server_url}/${product.img}`}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.brand} - ${product.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500 text-sm">
                    No se encontraron productos
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
