import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";


 export function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathRef = useRef(pathname);

  useEffect(() => {
    // Solo restauramos si volvemos de un producto a una lista
    const isBackFromProduct = lastPathRef.current.includes('/productID') && !pathname.includes('/productID');
    lastPathRef.current = pathname;

    if (isBackFromProduct) {
      const saved = sessionStorage.getItem(`scroll-${pathname}`);
      if (saved) {
        const y = parseInt(saved);
        // Usar setTimeout para dar tiempo a que el contenido se renderice
        const timer = setTimeout(() => {
          window.scrollTo({ top: y, behavior: 'instant' });
        }, 50);
        return () => clearTimeout(timer);
      }
    }

    // Para cualquier otra navegación, forzamos el top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      // Guardamos la posición solo en páginas que no sean detalle de producto
      if (!pathname.includes('/productID')) {
        sessionStorage.setItem(`scroll-${pathname}`, window.scrollY.toString());
      }
    };

    // Debounce manual para no saturar el storage
    let timeoutId: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', debouncedScroll);
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}

