'use client';

import { usePathname,  useRouter } from 'next/navigation';
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
import useAuthStore, { initializeAuthSync } from "@/store/authStore";
import useCartStore, { initializeCartSync } from "@/store/cartStore";
import useClockStore from "@/store/clockStore";
import { ScrollToTop } from '@/utils/scrollToTop';



export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { province, municipality, isOpen, setIsOpen } = useProductsByLocationStore();
  const { syncCart } = useSyncCart(true);
  const auth = useAuthStore((state) => state.auth);
  const items = useCartStore((state) => state.items);
  const startClock = useClockStore((state) => state.startClock);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasSynced = useRef(false);

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/verificationEmail')|| pathname.startsWith('/changePassword') || pathname.startsWith('/recoverPassword')|| pathname.startsWith('/verificationCodeEmail')|| pathname.startsWith('/enterEmail');
  
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setIsHydrated(true);
    startClock();
  }, []);

  useEffect(() => {
    const cleanupAuth = initializeAuthSync();
    const cleanupCart = initializeCartSync();

    return () => {
      cleanupAuth();
      cleanupCart();
    };
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
