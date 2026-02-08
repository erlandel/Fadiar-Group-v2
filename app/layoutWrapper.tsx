'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense, useRef } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import RouteLoading from "@/components/routeLoading/routeLoading";
import RouteChangeListener from "@/components/RouteChangeListener";
import ButtonBackTop from "@/components/buttonBackTop/buttonBackTop";
import ButtonFloatingCart from "@/components/buttonFloatingCart/buttonFloatingCart";
import ModalProductsByLocation from "@/components/modalProductsByLocation/modalProductsByLocation";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { useSyncCart } from "@/hooks/cartRequests/useSyncCart";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";

function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const lastProductId = sessionStorage.getItem('last-product-id');
    
    const scrollToTarget = () => {
      if (lastProductId && !pathname.includes('/productID')) {
        // Buscamos todos los elementos que tengan este ID (pueden haber duplicados en carousels o versiones mobile/desktop)
        const elements = document.querySelectorAll(`[id="product-${lastProductId}"]`);
        
        // Intentamos encontrar uno que sea visible en el DOM
        const visibleElement = Array.from(elements).find(el => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return style.display !== 'none' && 
                 style.visibility !== 'hidden' && 
                 rect.width > 0 && 
                 rect.height > 0;
        });

        const target = visibleElement || elements[0];

        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          sessionStorage.removeItem('last-product-id');
          return true;
        }
      }
      return false;
    };

    const performScroll = () => {
      if (!scrollToTarget()) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.body.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    };

    if (lastProductId && !pathname.includes('/productID')) {
      // Intentamos varias veces para dar tiempo a que los productos y carousels se carguen
      let attempts = 0;
      const intervalId = setInterval(() => {
        if (scrollToTarget() || attempts > 10) {
          clearInterval(intervalId);
          if (attempts > 10) performScroll();
        }
        attempts++;
      }, 100);
      return () => clearInterval(intervalId);
    } else {
      performScroll();
      // Pequeño delay para asegurar que el contenido renderizado no desplace el scroll
      const timeoutId = setTimeout(performScroll, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [pathname, searchParams]);

  return null;
}



export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { province, municipality, isOpen, setIsOpen } = useProductsByLocationStore();
  const { syncCart } = useSyncCart();
  const auth = useAuthStore((state) => state.auth);
  const items = useCartStore((state) => state.items);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasSynced = useRef(false);

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/verificationEmail')|| pathname.startsWith('/changePassword') || pathname.startsWith('/recoverPassword')|| pathname.startsWith('/verificationCodeEmail')|| pathname.startsWith('/enterEmail');
  
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Protección de rutas del carrito
  useEffect(() => {
    if (isHydrated && pathname.startsWith('/cart')) {
      const isAuthenticated = !!auth;
      const hasItems = items.length > 0;

      if (!isAuthenticated || !hasItems) {
        router.replace("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, pathname, auth, router]);

  useEffect(() => {
    if (isHydrated && auth?.access_token && !hasSynced.current) {
      syncCart();
      hasSynced.current = true;
    } else if (!auth?.access_token) {
      hasSynced.current = false;
    }
  }, [isHydrated, auth?.access_token, syncCart]);

  useEffect(() => {
    if (isHydrated && (!province || !municipality) && !isAuthRoute) {
      setIsOpen(true);
    }
  }, [isHydrated, province, municipality, isAuthRoute, setIsOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.animate-on-scroll'));
    if (elements.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const anim = el.dataset.animate || 'animate__fadeInUp';
            el.classList.add('aos-animate', 'animate__animated', anim);
            io.unobserve(el);
          }
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname, children]);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <RouteChangeListener />
      </Suspense>
      {!isAuthRoute && <RouteLoading />}
      {isOpen && (
        <div className="fixed inset-0 z-100 flex  justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className='h-auto w-auto '>
          <ModalProductsByLocation />
          </div>
        </div>
      )}
      {!isAuthRoute && <Header />}
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      {children}
      {!isAuthRoute && <Footer />}
      {!isAuthRoute && <ButtonFloatingCart />}
      {!isAuthRoute && <ButtonBackTop />}
      <ToastContainer />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
