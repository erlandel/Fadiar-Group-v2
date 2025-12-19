'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from "@/component/header/header";
import Footer from "@/component/footer/footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/verificationEmail')|| pathname.startsWith('/changePassword') || pathname.startsWith('/verificationEmail')|| pathname.startsWith('/verificationCodeEmail');

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
    <>
      {!isAuthRoute && <Header />}
      {children}
      {!isAuthRoute && <Footer />}
    </>
  );
}
