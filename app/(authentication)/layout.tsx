"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const auth = useAuthStore((state) => state.auth);
  const [isHydrated, setIsHydrated] = useState(false);

  // Esperar a que el store de Zustand se hidrate desde localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Si ya terminó de hidratar y existe el auth (usuario logueado)
    if (isHydrated && auth) {
      router.replace("/");
    }
  }, [isHydrated, auth, router]);

  // Si no se ha hidratado o si está autenticado (mientras ocurre la redirección),
  // mostramos un estado vacío o un loader para evitar que se vea el contenido.
  if (!isHydrated || auth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
      
      </div>
    );
  }

  return <>{children}</>;
}
