'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ButtonBackTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const toggleVisibility = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      
      if (scrolled > 300) {
        setIsVisible(true);
        setIsScrolling(true);

        // Reiniciar el temporizador cada vez que hay scroll
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          setIsScrolling(false);
        }, 5000); // 5 segundos
      } else {
        setIsVisible(false);
        setIsScrolling(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, true);
    document.addEventListener('scroll', toggleVisibility, true);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      document.removeEventListener('scroll', toggleVisibility);
      clearTimeout(scrollTimer);
    };
  }, []);

  const scrollToTop = () => {
    const performScroll = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
      
      const main = document.querySelector('main');
      if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
    };

    performScroll();
    setTimeout(performScroll, 50);
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            scrollToTop();
          }}
          type="button"
          className={`z-9999 fixed right-3  bottom-10 2xl:right-5 flex h-8 w-8 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-110  active:scale-95 animate__animated ${
            isScrolling ? 'animate__fadeInRight opacity-100' : 'animate__fadeOutRight opacity-0 pointer-events-none'
          }`}

        
        >
          <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6 2xl:h-7 2xl:w-7" strokeWidth={2} />
        </button>
      )}
    </>
  );
}
