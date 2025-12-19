"use client";

import FloatingLabelInput from "@/component/authenticationComponent/FloatingLabelInput";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputAuthCode from "@/component/inputAuthCode/inputAuthCode";

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
    <>
      <div className="bg-[#e7e8e9] min-h-dvh w-full flex items-center justify-center overflow-hidden">
        <div className="bg-white w-130 h-auto rounded-2xl mx-4 shadow-xl">
          <div className="p-6  sm:p-7 ">
            <div className="flex justify-center items-center flex-col text-center">
              <div>
                <h3 className="text-primary text-2xl sm:text-3xl font-bold">
                  Verificar cuenta
                </h3>
              </div>

              <div className="text-gray-600 mt-1 sm:mt-3 ">
                Hemos enviado un código de verificación de 6 dígitos a:
              </div>
              <div className="text-primary mt-2 sm:mt-3 font-bold sm:text-lg">
                <p>{email}</p>
              </div>

                <div className="text-gray-500 mt-2 sm:mt-3 text-xs sm:text-sm">
               Revisa tu bandeja de entrada y spam. El código expira en 10 minutos.
              </div>

              <div className="text-primary font-bold mt-3 sm:mt-5">
                <p>Ingresa el código de verificación</p>
              </div>

              <form className="w-full   mt-3 sm:mt-4">
                <InputAuthCode />
              </form>
          

              <div className=" mt-4 sm:mt-6 w-full">
                <button
                  className="bg-primary text-white w-full  rounded-xl px-3 py-2 cursor-pointer hover:bg-[#034078] hover:shadow-lg 
              "
                >Verificar cuenta</button>
              </div>

              <div className="mt-5 space-y-2 text-gray-500 text-center text-sm ">
                <div className="flex">
                  <p>¿No recibiste el código?</p>
                  <Link
                    href="/register"
                    className="text-primary font-bold   no-underline  hover:underline transition-colors ml-1"
                  >
                    Reenviar código
                  </Link>
                </div>

               
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
