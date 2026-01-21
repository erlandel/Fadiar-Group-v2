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
    stopLoading();
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
        !anchor.href.startsWith("tel:")
      ) {
        const targetPath = anchor.pathname;
        const targetSearch = anchor.search;
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;

        // Solo activar si la ruta es diferente a la actual
        if (targetPath !== currentPath || targetSearch !== currentSearch) {
          startLoading();
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [startLoading]);

  return null;
}
