"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import useLoadingStore from "@/store/loadingStore";

export default function RouteChangeListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const stopLoading = useLoadingStore((state) => state.stopLoading);
  const startLoading = useLoadingStore((state) => state.startLoading);

  // Detener el loader cuando la ruta cambia efectivamente
  useEffect(() => {
    // En estático, el cambio de ruta puede ser instantáneo o fallar en disparar el useEffect
    // si la ruta se normaliza internamente por Next.js.
    // Usamos un pequeño delay para asegurar que el DOM se haya actualizado
    const handle = requestAnimationFrame(() => {
      stopLoading();
    });
    return () => cancelAnimationFrame(handle);
  }, [pathname, searchParams, stopLoading]);

  // Interceptar clicks globales en enlaces para activar el loader
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor &&
        anchor.href &&
        !anchor.target &&
        anchor.origin === window.location.origin &&
        !anchor.hasAttribute("download") &&
        !anchor.href.startsWith("mailto:") &&
        !anchor.href.startsWith("tel:") &&
        !anchor.href.startsWith("#") &&
        !e.defaultPrevented &&
        e.button === 0 && // Solo click izquierdo
        !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey // Sin teclas modificadoras
      ) {
        const normalizePath = (path: string) => {
          let p = path.split("?")[0].split("#")[0];
          return p.endsWith("/") ? p : `${p}/`;
        };

        const targetPath = normalizePath(anchor.pathname);
        const currentPath = normalizePath(window.location.pathname);
        
        const targetSearch = anchor.search;
        const currentSearch = window.location.search;

        // Solo activar si la ruta o búsqueda es diferente a la actual
        if (targetPath !== currentPath || targetSearch !== currentSearch) {
          // Si el click fue en un botón dentro del anchor o similar, 
          // a veces el router de Next.js no navega si se hace stopPropagation
          startLoading();
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => document.removeEventListener("click", handleAnchorClick, { capture: true });
  }, [startLoading]);

  return null;
}
