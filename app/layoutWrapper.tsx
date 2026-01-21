'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useRef } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import RouteLoading from "@/components/routeLoading/routeLoading";
import RouteChangeListener from "@/components/RouteChangeListener";
import ButtonBackTop from "@/components/buttonBackTop/buttonBackTop";
import ModalProductsByLocation from "@/components/modalProductsByLocation/modalProductsByLocation";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { useSyncCart } from "@/hooks/cartRequests/useSyncCart";
import useAuthStore from "@/store/authStore";

function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.body.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    scrollToTop();
    // Ejecutar de nuevo tras un breve delay para asegurar que el contenido renderizado no desplace el scroll
    const timeoutId = setTimeout(scrollToTop, 10);
    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams]);

  return null;
}



export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { province, municipality, isOpen, setIsOpen } = useProductsByLocationStore();
  const { syncCart } = useSyncCart();
  const auth = useAuthStore((state) => state.auth);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasSynced = useRef(false);

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/verificationEmail')|| pathname.startsWith('/changePassword') || pathname.startsWith('/recoverPassword')|| pathname.startsWith('/verificationCodeEmail')|| pathname.startsWith('/enterEmail');
  
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
  }, [pathname]);

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
      {!isAuthRoute && <ButtonBackTop />}
      <ToastContainer 
        position="top-right"
        className="xl:top-auto! xl:bottom-4!"
      />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
