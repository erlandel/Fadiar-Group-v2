"use client";

import FloatingLabelInput from "@/component/authenticationComponent/FloatingLabelInput";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerificationCodeEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Recuperar el correo del localStorage
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Si no hay correo, redirigir al registro
      // router.push("/register");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validar que el código no esté vacío
    if (!code.trim()) {
      setError("Ingresa el código de verificación");
      return;
    }

    // Validar que el email exista y no esté vacío
    if (!email || !email.trim()) {
      setError("No se encontró el correo electrónico");
      router.push("/register");
      return;
    }

    try {
      const response = await fetch(
        "https://app.fadiar.com:444/prueba/api/email_verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code.trim(),
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Verificación exitosa
        localStorage.removeItem("verificationEmail");
        router.push("/login");
      } else {
        setError(data.message || "Código de verificación inválido");
      }
    } catch (error) {
      console.error("Error al verificar el código:", error);
      setError("Error al verificar el código. Intenta nuevamente.");
    }
  };

  const handleResendCode = async () => {
    setError("");

    // Validar que el email exista y no esté vacío
    if (!email || !email.trim()) {
      setError("No se encontró el correo electrónico");
      router.push("/register");
      return;
    }

    try {
      const response = await fetch(
        "https://app.fadiar.com:444/prueba/api/resend_verification_email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );  

   
    } catch (error) {
      console.error("Error al reenviar el código:", error);
      setError("Error al reenviar el código. Intenta nuevamente.");
    }
  };

  return (
    <div className="h-full md:min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('/images/authenticationBackground.png')] p-4">
      {/* Container principal con animación circular */}
      <div className="relative w-[400px] h-[500px] flex items-center justify-center rounded-full overflow-hidden">
        {/* Spans animados en círculo - 270 grados (lado derecho y superior/inferior) */}
        {[...Array(38)].map((_, i) => {
          // Calcular ancho: más pequeño al inicio y final, más grande en el centro
          const progress = i / 37; // 0 a 1
          const widthScale = 0.3 + Math.sin(progress * Math.PI) * 0.7; // 0.3 a 1
          const width = Math.round(32 * widthScale * 100) / 100; // Redondear a 2 decimales
          const rotation = Math.round((-135 + i * (270 / 38)) * 100) / 100;
          const delay = Math.round(i * (3 / 38) * 100) / 100;

          return (
            <span
              key={i}
              className="absolute left-0 h-1.5 bg-primary rounded-full animate-blink"
              style={{
                width: `${width}px`,
                transformOrigin: "200px",
                transform: `rotate(${rotation}deg)`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}

        {/* Login Box */}
        <div className="absolute left-12 w-4/5 max-w-[320px] z-10 p-5 rounded-3xl">
          <form className="w-full px-2.5" onSubmit={handleSubmit}>
            <h2 className="text-3xl text-[#f4f4f4] text-center mb-2.5 font-semibold">
              Verifiar correo
            </h2>

            {/* Code Input */}
            <FloatingLabelInput
              type="text"
              label="Código de verificación"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              
            />

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center mt-2">
                {error}
              </div>
            )}

            <div className="text-center my-4">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-md font-bold no-underline text-gray cursor-pointer hover:underline transition-colors"
              >
                Reenviar código
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-accent border-none outline-none rounded-full cursor-pointer text-base text-white font-semibold hover:bg-accent/90 transition-all"
            >
              Confirmar
            </button>

            {/* Sign Up Link */}
            <div className="mt-2.5 text-center">
              <Link
                href="/login"
                className="text-base text-gray no-underline font-semibold hover:underline"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
