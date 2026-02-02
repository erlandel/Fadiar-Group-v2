'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ButtonBackTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Intentamos obtener el scroll de varias fuentes comunes
      const scrolledY = 
        window.scrollY || 
        window.pageYOffset || 
        document.documentElement.scrollTop || 
        document.body.scrollTop ||
        (document.querySelector('main')?.scrollTop || 0);
      
      if (scrolledY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Usamos true para capturar el evento en la fase de captura, 
    // lo que permite detectar scroll en elementos hijos si el window no es el que scrollea.
    window.addEventListener('scroll', toggleVisibility, true);
    document.addEventListener('scroll', toggleVisibility, true);
    
    toggleVisibility();
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility, true);
      document.removeEventListener('scroll', toggleVisibility, true);
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
    // Reintentar brevemente para asegurar que se procese el scroll en contenedores
    setTimeout(performScroll, 50);
    setTimeout(performScroll, 150);
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollToTop();
      }}
      type="button"
      className={`z-999 fixed right-3 bottom-10 2xl:right-5 flex h-8 w-8 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-110 active:scale-95 animate__animated ${
        isVisible ? 'animate__fadeInRight opacity-100' : 'animate__fadeOutRight opacity-0 pointer-events-none'
      }`}
    >
      <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6 2xl:h-7 2xl:w-7" strokeWidth={2} />
    </button>
  );
}
