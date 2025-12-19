"use client";

import FloatingLabelInput from "@/component/authenticationComponent/FloatingLabelInput";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterFormData } from "@/validations/registerSchema";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    lastname1: "",
    lastname2: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((error) => {
        const key = error.path[0] as string | undefined;
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = error.message; // keep first message only
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    const dataToSend = {
      name: formData.name,
      lastname1: formData.lastname1,
      lastname2: formData.lastname2,
      email: formData.email,
      password: formData.password,
      type: "Cliente",
    };

    console.log("Datos a enviar:", dataToSend);

    try {
      const response = await fetch("https://app.fadiar.com:444/prueba/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      console.log(response)

      if (response.ok) {
        const data = await response.json();
        console.log("Registro exitoso:", data);
        
        // Guardar el correo en localStorage
        localStorage.setItem("verificationEmail", formData.email);
        
        router.push("/verificationCodeEmail");
      } else {
        throw new Error("Error en el registro");
      }      

   
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: "Error al registrar. Intenta nuevamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
 <div className="h-full  md:min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('/images/authenticationBackground.png')] p-4">
      {/* Container principal con animación circular */}
      <div className="relative w-full md:w-[720px] md:h-[600px] flex items-center justify-center md:rounded-full md:overflow-hidden">
        {/* Spans animados en círculo - 270 grados (lado derecho y superior/inferior) */}
        {[...Array(45)].map((_, i) => {
          // Calcular ancho: más pequeño al inicio y final, más grande en el centro
          const progress = i / 44; // 0 a 1
          const widthScale = 0.3 + Math.sin(progress * Math.PI) * 0.7; // 0.3 a 1
          const width = Math.round(50 * widthScale * 100) / 100; // Redondear a 2 decimales
          const rotation = Math.round((-135 + i * (270 / 45)) * 100) / 100;
          const delay = Math.round(i * (3 / 45) * 100) / 100;

          return (
            <span
              key={i}
              className="absolute left-10 h-1.5 hidden md:block bg-primary rounded-full animate-blink"
              style={{
                width: `${width}px`,
                transformOrigin: "280px",
                transform: `rotate(${rotation}deg)`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}

        {/* Login Box */}
        <div className="md:absolute  mx-4 md:mx-0 w-full md:w-[500px] z-10  md:p-5 md:rounded-3xl">
          <form className="  md:w-full md:px-2.5" onSubmit={handleSubmit}>
            <h2 className="text-3xl text-[#f4f4f4] text-center  md:mb-2.5 font-semibold">
              Registro
            </h2>

            {/* Nombre y Primer Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-3">
              <div>
                <FloatingLabelInput 
                  type="text" 
                  label="Nombre" 
     
                  value={formData.name}
                  onChange={handleChange("name")}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <FloatingLabelInput
                  type="text"
                  label="Primer Apellido"
    
                  value={formData.lastname1}
                  onChange={handleChange("lastname1")}
                />
                {errors.lastname1 && <p className="text-red-500 text-xs mt-1">{errors.lastname1}</p>}
              </div>
            </div>

            {/* Segundo Apellido y Correo */}
                <div className="grid grid-cols-1 md:grid-cols-2  md:gap-3">
              <div>
                <FloatingLabelInput
                  type="text"
                  label="Segundo Apellido"
    
                  value={formData.lastname2}
                  onChange={handleChange("lastname2")}
                />
                {errors.lastname2 && <p className="text-red-500 text-xs mt-1">{errors.lastname2}</p>}
              </div>
              <div>
                <FloatingLabelInput 
                  type="text" 
                  label="Correo" 
     
                  value={formData.email}
                  onChange={handleChange("email")}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Contraseñas */}
                <div className="grid grid-cols-1 md:grid-cols-2  md:gap-3">
              <div>
                <FloatingLabelInput 
                  type="password" 
                  label="Contraseña" 
     
                  value={formData.password}
                  onChange={handleChange("password")}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <FloatingLabelInput
                  type="password"
                  label="Repetir contraseña"
    
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {errors.submit && <p className="text-red-500 text-sm text-center mt-2">{errors.submit}</p>}

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
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/2 h-11 bg-accent border-none outline-none rounded-full cursor-pointer text-base text-white font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-2.5 text-center">
              <Link
                href="/login"
                className="text-base text-gray no-underline  font-semibold hover:underline"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
