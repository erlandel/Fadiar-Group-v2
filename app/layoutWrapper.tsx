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
import ModalProductsByLocation from "@/components/modal/modalProductsByLocation/modalProductsByLocation";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { useSyncCart } from "@/hooks/cartRequests/useSyncCart";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";

function ScrollToTop() {
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
      <div className="relative flex min-h-screen w-full flex-col">
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
        <main className="grow w-full">
          {children}
        </main>
        {!isAuthRoute && <Footer />}
        {!isAuthRoute && <ButtonFloatingCart />}
        {!isAuthRoute && <ButtonBackTop />}
        <ToastContainer />
      </div>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
