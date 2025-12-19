"use client";

import FloatingLabelInput from "@/component/authenticationComponent/FloatingLabelInput";
import Link from "next/link";
import { useState } from "react";
import { loginSchema, type LoginFormData } from "@/validations/loginSchema";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";


export default function Login() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    // Validar con Zod
    const result = loginSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof LoginFormData] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Llamar al API
    setIsLoading(true);
    try {
      const response = await fetch("https://app.fadiar.com:444/prueba/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
      // Aquí puedes manejar la respuesta exitosa (guardar token, redirigir, etc.)
      const userInfo = (data?.user_info ?? data?.data?.user_info) ?? null;
      const access = userInfo?.access_token ?? null;
      const refresh = userInfo?.refresh_token ?? null;
      setAuth({
        email: formData.email,
        access_token: access,
        refresh_token: refresh,
      });
        console.log("Login exitoso:", data);
         router.push("/");
      }else{
   const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

   
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="h-full md:min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 bg-[url('/images/authenticationBackground.png')]">
      {/* Container principal con animación circular */}
      <div className="relative w-[430px] h-[500px] flex items-center justify-center rounded-full overflow-hidden">
        {/* Para pantallas pequeñas (< sm) - 240 grados */}
        <div className="block sm:hidden">
          {[...Array(38)].map((_, i) => {
            // Calcular ancho: más pequeño al inicio y final, más grande en el centro
            const progress = i / 37; // 0 a 1
            const widthScale = 0.3 + Math.sin(progress * Math.PI) * 0.7; // 0.3 a 1
            const width = Math.round(32 * widthScale * 100) / 100; // Redondear a 2 decimales
            const rotation = Math.round((-118 + i * (240 / 38)) * 100) / 100; // 240 grados
            const delay = Math.round((i * (3 / 38)) * 100) / 100;
            
            return (
              <span
                key={i}
                className="absolute left-0 h-1.5 bg-primary rounded-full animate-blink"
                style={{
                  width: `${width}px`,
                  transformOrigin: "210px",
                  transform: `rotate(${rotation}deg)`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Para pantallas grandes (≥ sm) - 270 grados */}
        <div className="hidden sm:block">
          {[...Array(38)].map((_, i) => {
            // Calcular ancho: más pequeño al inicio y final, más grande en el centro
            const progress = i / 37; // 0 a 1
            const widthScale = 0.3 + Math.sin(progress * Math.PI) * 0.7; // 0.3 a 1
            const width = Math.round(32 * widthScale * 100) / 100; // Redondear a 2 decimales
            const rotation = Math.round((-135 + i * (270 / 38)) * 100) / 100; // 270 grados
            const delay = Math.round((i * (3 / 38)) * 100) / 100;
            
            return (
              <span
                key={i}
                className="absolute left-0 h-1.5 bg-primary rounded-full animate-blink"
                style={{
                  width: `${width}px`,
                  transformOrigin: "210px",
                  transform: `rotate(${rotation}deg)`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Login Box */}
        <div className="absolute left-12 sm:left-auto w-4/5 max-w-[300px] z-10 p-5 rounded-3xl">
          <form className="w-full px-2.5" onSubmit={handleSubmit}>
            <h2 className="text-3xl text-[#f4f4f4] text-center  font-semibold">
              Login
            </h2>

            {/* Error general del API */}
            {apiError && (
              <div className="mb-4 p-2 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm text-center">
                {apiError}
              </div>
            )}

            {/* Email Input */}
            <FloatingLabelInput
              type="email"
              label="Correo"           
              value={formData.email}
              onChange={handleChange("email")}
              error={errors.email}
            />

            {/* Password Input */}
            <FloatingLabelInput
              type="password"
              label="Contraseña"            
              value={formData.password}
              onChange={handleChange("password")}
              error={errors.password}
            />

            {/* Forgot Password */}
            <div className="text-center  my-4">
              <Link
                href="/verificationEmail"
                className="text-md font-bold no-underline text-gray  hover:underline transition-colors"
              >
               ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full  h-11 bg-accent border-none outline-none rounded-full cursor-pointer text-base text-white font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Iniciando sesión..." : "Login"}
            </button>

            {/* Sign Up Link */}
            <div className="mt-2.5 text-center">
              <Link
                href="/register"
                className="text-base text-gray no-underline  font-semibold hover:underline"
              >
                Registrarse 
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
