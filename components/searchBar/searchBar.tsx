"use client";
import { IcSharpSearch } from "@/icons/icons";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { server_url } from "@/lib/apiClient";
import { Product } from "@/types/product";
import { useInventory } from "@/hooks/productRequests/useInventory";

function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

export default function Serchbar() {
  const { data, isLoading } = useInventory();
  const allProducts = data?.products || [];
  
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

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
      const q = value.trim().toLowerCase();
      const threshold = Math.max(2, Math.floor(q.length * 0.4));
      const ranked = allProducts
        .map((product) => {
          const name = product.name.toLowerCase();
          const brand = product.brand.toLowerCase();
          const includes = name.includes(q) || brand.includes(q);
          const dist = Math.min(levenshtein(name, q), levenshtein(brand, q));
          const score = includes ? 0 : dist;
          return { product, score };
        })
        .filter((item) => item.score <= threshold)
        .sort((a, b) => a.score - b.score)
        .map((item) => item.product);
      setSearchResults(ranked);
      setIsOpen(true);
    }
  };

  const handleProductClick = (productId: number) => {
    router.push(`/productID?id=${productId}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      <div>
        <div className="flex justify-center w-full  xl:w-160  ">
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
