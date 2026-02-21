"use client";

import { IcSharpSearch } from "@/icons/icons";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { onClickOutside } from "@/utils/clickOutside";
import { Product } from "@/types/product";
import { useInventory } from "@/hooks/productRequests/useInventory";
import { server_url } from "@/urlApi/urlApi";
import useLoadingStore from "@/store/loadingStore";

/**
 * Normaliza el texto para comparaciones consistentes.
 * Incluye simplificación fonética básica (k -> c, v -> b, z -> s) para mejorar la búsqueda.
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/k/g, "c")
    .replace(/q/g, "c")
    .replace(/v/g, "b")
    .replace(/z/g, "s")
    .replace(/y/g, "i") // Añadido para capturar i/y
    .replace(/h/g, "")  // La h es muda, mejor quitarla para comparar
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

/**
 * Calcula un score de relevancia usando Levenshtein (distancia de edición).
 * - Tolera letras cambiadas/eliminadas/agregadas
 * - Ordena por "mejor coincidencia" (menor distancia => mayor score)
 * - Mantiene el requisito: con 1 sola letra en común debe poder dar match (score > 0)
 */
function calculateScore(query: string, target: string): number {
  const q = normalize(query), t = normalize(target);
  if (!q || !t) return 0;

  // Atajos de alta relevancia
  if (t === q) return 1000;
  if (t.startsWith(q)) return 850;
  if (t.includes(q)) return 700;

  // Requisito: si no hay ni 1 letra en común, no hay match.
  // (Esto evita que Levenshtein fuerce coincidencias “basura”.)
  let hasCommon = false;
  const tSet = new Set(t.split(""));
  for (const ch of q) {
    if (tSet.has(ch)) {
      hasCommon = true;
      break;
    }
  }
  if (!hasCommon) return 0;

  // Levenshtein O(n*m) con memoria O(m)
  const levenshtein = (a: string, b: string) => {
    const n = a.length;
    const m = b.length;
    if (n === 0) return m;
    if (m === 0) return n;

    let prev = new Array<number>(m + 1);
    let curr = new Array<number>(m + 1);
    for (let j = 0; j <= m; j++) prev[j] = j;

    for (let i = 1; i <= n; i++) {
      curr[0] = i;
      const ai = a.charCodeAt(i - 1);
      for (let j = 1; j <= m; j++) {
        const cost = ai === b.charCodeAt(j - 1) ? 0 : 1;
        curr[j] = Math.min(
          prev[j] + 1, // delete
          curr[j - 1] + 1, // insert
          prev[j - 1] + cost // substitute
        );
      }
      const tmp = prev;
      prev = curr;
      curr = tmp;
    }
    return prev[m];
  };

  const dist = levenshtein(q, t);
  const maxLen = Math.max(q.length, t.length) || 1;
  const similarity = 1 - dist / maxLen; // 1 = idéntico, 0 = muy distinto

  // Bonos suaves para desempate cuando similarity es parecida
  let commonCount = 0;
  const fq = new Map<string, number>();
  for (const ch of q) fq.set(ch, (fq.get(ch) ?? 0) + 1);
  const ft = new Map<string, number>();
  for (const ch of t) ft.set(ch, (ft.get(ch) ?? 0) + 1);
  for (const [ch, c] of fq.entries()) {
    const ct = ft.get(ch);
    if (ct) commonCount += Math.min(c, ct);
  }

  const score = Math.round(similarity * 500) + commonCount * 10;
  return Math.max(1, score);
}

export default function Searchbar() {
  const { data, isLoading } = useInventory();
  const allProducts = data?.products ?? [];

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const startLoading = useLoadingStore((state) => state.startLoading);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  /**
   * Cerrar dropdown al hacer click fuera
   */
  useEffect(() => {
    const cleanup = onClickOutside(searchRef, () => setIsOpen(false), {
      enabled: isOpen,
    });
    return cleanup;
  }, [isOpen]);

  /**
   * Búsqueda optimizada con Jaro-Winkler 
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSearchResults([]);
      setIsOpen(false);
      return;
    }

    const seenIds = new Set();
    const ranked = allProducts
      .map((product) => {
        const nameScore = calculateScore(value, product.name);
        const brandScore = calculateScore(value, product.brand);
        const categoryScore = calculateScore(value, product.categoria?.name || "");
        
        // Priorizamos el nombre del producto, seguido de marca y categoría.
        const score = Math.max(
          nameScore,
          Math.floor(brandScore * 0.85),
          Math.floor(categoryScore * 0.75)
        );

        return { product, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product)
      .filter((product) => {
        if (seenIds.has(product.id)) return false;
        seenIds.add(product.id);
        return true;
      });

    setSearchResults(ranked);
    setIsOpen(true);
  };

  const handleProductClick = (productId: string) => {
    startLoading();
    router.push(`/productID?id=${productId}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="flex justify-center w-full xl:w-185 xl:ml-4">
      <div
        ref={searchRef}
        className="relative w-full md:min-w-120 xl:max-w-185"
      >
        <input
          type="text"
          placeholder="Buscar producto"
          value={query}
          onChange={handleSearch}
          onFocus={() => query && setIsOpen(true)}
          className="w-full outline-none text-base text-black placeholder-gray-400 bg-transparent pl-4 pr-12 pb-1 border-b border-[#022954]"
        />

        <button className="absolute right-3 top-0 cursor-pointer ">
          <IcSharpSearch className="w-7 h-7 text-gray-800" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-gray-500 text-sm">
                Buscando productos...
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.slice(0, 5).map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className={`p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 animate-fade-in-up [animation-delay:${index * 50}ms]`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={`${server_url}/${product.img}`}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm  text-gray-900 font-bold">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.brand} - $
                        {product.temporal_price && Number(product.temporal_price) > 0
                          ? product.temporal_price
                          : product.price}{" "}
                        {product.currency?.currency}
                      </p>
                        <p className="text-xs  text-blue-900 ">
                        {product.categoria?.name}
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
  );
}
