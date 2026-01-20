
"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProductLoadingId() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Guardamos la URL inicial para detectar cambios
  const [initialUrl] = useState(pathname + searchParams.toString());

  useEffect(() => {
    // Si la URL cambia, cerramos el loader de inmediato
    if (pathname + searchParams.toString() !== initialUrl) {
      setIsVisible(false);
    }
  }, [pathname, searchParams, initialUrl]);

 

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/1 backdrop-blur-xs">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-accent rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}

