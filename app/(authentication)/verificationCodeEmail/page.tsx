"use client";

import FloatingLabelInput from "@/components/authenticationComponent/FloatingLabelInput";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputAuthCode from "@/components/inputAuthCode/inputAuthCode";
import { Loader, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import MessageErrorAuth from "@/components/messageErrorAuth/messageErrorAuth";
import { verifyCodeEmailUrl } from "@/urlApi/urlApi";


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

  const verifyCodeMutation = useMutation({    
    mutationFn: async (payload: { code: string; email: string }) => {
       console.log("payload a enviar:", payload);
      const response = await fetch(
        `${verifyCodeEmailUrl}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      console.log('response:', response);
      console.log("response status:", response.status);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || " Error al verificar la cuenta");
      }
      return data;
    },
    onSuccess: () => {
      localStorage.removeItem("verificationEmail");
      router.push("/login");
    },
    onError: (err: any) => {
      setError(
        err?.message || "Error al verificar el código. Intenta nuevamente."
      );
    },
  });

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


    verifyCodeMutation.mutate({
      code: code.trim(),
      email: email.trim(),
    });
    
    console.log("Email:", email);
    console.log("Code:", code);
  };

  const handleResendCode = async () => {
    // setError("");

    // Validar que el email exista y no esté vacío
    if (!email || !email.trim()) {
      console.log("email no existe");
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
      console.log("Renvio de codigo: " + response.status);
    } catch (error) {
      console.error("Error al reenviar el código:", error);
      setError("Error al reenviar el código. Intenta nuevamente.");
    }
  };

  return (
    <>
      <div className="bg-[#e7e8e9] min-h-dvh w-full flex items-center justify-center overflow-hidden">
        <div className="bg-white w-125 h-auto rounded-2xl mx-4 shadow-xl">
          <div className="p-6  sm:p-7 ">
            <div className="flex justify-center items-center flex-col text-center">
              <div>
                <h3 className="text-primary text-2xl sm:text-3xl font-bold">
                  Verificar cuenta
                </h3>
              </div>

              <div className="text-gray-600 mt-1 sm:mt-3 text-sm">
                Hemos enviado un código de verificación de 6 dígitos a:
              </div>
              <div className="text-primary mt-2 sm:mt-3 font-bold sm:text-lg">
                <p>{email}</p>
              </div>

              <div className="text-gray-500 mt-2 sm:mt-3 text-xs ">
                Revisa tu bandeja de entrada y spam. El código expira en 10
                minutos.
              </div>

              <div className="text-primary font-bold mt-3 sm:mt-5">
                <p>Ingresa el código de verificación</p>
              </div>

              <form className="w-full   mt-3 sm:mt-4" onSubmit={handleSubmit}>
                <InputAuthCode value={code} onChange={setCode} />
                <div className=" mt-4 sm:mt-6 w-full">
                  <button
                    type="submit"
                    className="bg-primary text-white w-full  rounded-xl px-3 py-2 cursor-pointer hover:bg-[#034078] hover:shadow-lg disabled:opacity-40 disabled:cursor-default disabled:pointer-events-none"
                    disabled={
                      verifyCodeMutation.isPending || code.trim().length !== 6
                    }
                  >
                    {verifyCodeMutation.isPending ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader className="h-5 w-5 animate-spin" />
                        Verificando...
                      </span>
                    ) : (
                      "Verificar cuenta"
                    )}
                  </button>
                </div>
              </form>
 
               {!!error && (
                <div className="w-full mt-5">
                  <MessageErrorAuth 
                  message={error} 
                  icon={<X className="w-6 h-6  shrink-0" />} 
                  center 
                  className="flex items-center justify-center gap-1 border border-red-200 bg-red-50 text-red-600 rounded-lg px-3 py-3"
                  />
                </div>
               )} 

              <div className="mt-4 space-y-2 text-gray-500 text-center text-xs ">
                <div className="flex">
                  <p>¿No recibiste el código?</p>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleResendCode();
                    }}
                    className="text-primary  no-underline  hover:underline transition-colors ml-1"
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
