'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "@/component/header/header";
import Footer from "@/component/footer/footer";
import ModalProductsByLocation from "@/component/modalProductsByLocation/modalProductsByLocation";
import useProductsByLocationStore from "@/store/productsByLocationStore";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { province, municipality, isOpen, setIsOpen } = useProductsByLocationStore();
  const [isHydrated, setIsHydrated] = useState(false);

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/verificationEmail')|| pathname.startsWith('/changePassword') || pathname.startsWith('/recoverPassword')|| pathname.startsWith('/verificationCodeEmail');
  
  const queryClient = new QueryClient();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
      {isOpen && (
        <div className="fixed inset-0 z-100 flex  justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className='h-auto w-auto '>
          <ModalProductsByLocation />
          </div>
        </div>
      )}
      {!isAuthRoute && <Header />}
      {children}
      {!isAuthRoute && <Footer />}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
