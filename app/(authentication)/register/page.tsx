"use client";

import FloatingLabelInput from "@/components/authenticationComponent/FloatingLabelInput";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  registerSchema,
  type RegisterFormData,
} from "@/validations/registerSchema";
import InputAuth from "@/components/inputAuth/inputAuth";
import { User, Mail, Lock, Loader, Eye, EyeOff, Check, X } from "lucide-react";

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
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange =
    (field: keyof RegisterFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const updated = { ...formData, [field]: value };
      setFormData(updated);
      const newErrors = { ...errors };
      if (field === "email") {
        const res = registerSchema.shape.email.safeParse(value);
        newErrors.email =
          value.trim().length > 0 && !res.success ? "Debe ser un correo válido" : "";
      } else if (field === "password") {
        newErrors.password =
          value.trim().length > 0 && value.trim().length < 6
            ? "La contraseña debe tener al menos 6 caracteres"
            : "";
        if (updated.confirmPassword.trim().length > 0) {
          newErrors.confirmPassword =
            updated.confirmPassword === value ? "" : "Las contraseñas no coinciden";
        }
      } else if (field === "confirmPassword") {
        newErrors.confirmPassword =
          value.trim().length > 0 && value !== updated.password
            ? "Las contraseñas no coinciden"
            : "";
      } else {
        newErrors[field] = "";
      }
      setErrors(newErrors);
      const count =
        (isFullNameValid(updated) ? 1 : 0) +
        (isEmailValid(updated.email) ? 1 : 0) +
        (isPasswordValid(updated.password) ? 1 : 0) +
        (isConfirmValid(updated.password, updated.confirmPassword) ? 1 : 0);
      setProgress(count * 25);
    };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    const trimmed = value.trim().replace(/\s+/g, " ");
    if (trimmed.length === 0) {
      setFormData({
        ...formData,
        name: "",
        lastname1: "",
        lastname2: "",
      });
      setErrors({ ...errors, name: "", lastname1: "", lastname2: "" });
      return;
    }
    const parts = trimmed.split(" ");
    const name = parts.shift() ?? "";
    const lastname1 = parts.shift() ?? "";
    const lastname2 = parts.join(" ");
    const updated = {
      ...formData,
      name,
      lastname1,
      lastname2,
    };
    setFormData(updated);
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const newErrors = { ...errors };
    newErrors.name = name.trim().length > 0 && !nameRegex.test(name) ? "Error de escritura" : "";
    newErrors.lastname1 =
      lastname1.trim().length === 0
        ? "Ingresa el primer apellido"
        : !nameRegex.test(lastname1)
        ? "Error de escritura"
        : "";
    newErrors.lastname2 =
      lastname2.trim().length === 0
        ? "Ingresa el segundo apellido"
        : !nameRegex.test(lastname2)
        ? "Error de escritura"
        : "";
    setErrors(newErrors);
    const count =
      (isFullNameValid(updated) ? 1 : 0) +
      (isEmailValid(updated.email) ? 1 : 0) +
      (isPasswordValid(updated.password) ? 1 : 0) +
      (isConfirmValid(updated.password, updated.confirmPassword) ? 1 : 0);
    setProgress(count * 25);
  };

  const isFullNameValid = (data: RegisterFormData) => {
    const r = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return (
      data.name.trim().length > 0 &&
      data.lastname1.trim().length > 0 &&
      data.lastname2.trim().length > 0 &&
      r.test(data.name) &&
      r.test(data.lastname1) &&
      r.test(data.lastname2)
    );
  };
  const isEmailValid = (email: string) =>
    registerSchema.shape.email.safeParse(email).success;
  const isPasswordValid = (password: string) => password.trim().length >= 6;
  const isConfirmValid = (password: string, confirm: string) =>
    confirm.trim().length > 0 && confirm === password;

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
      const response = await fetch(
        "https://app.fadiar.com:444/prueba/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      console.log(response);

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
      <div className="bg-[#e7e8e9] h-screen w-screen flex justify-center items-center">
        <div className="bg-white w-110 h-auto rounded-2xl mx-4 shadow-xl">
          <div className="flex justify-center items-center flex-col p-7">
            <div>
              <h3 className="text-primary text-2xl sm:text-3xl font-bold">
                Registrarse
              </h3>
            </div>

            <div className="mt-1 text-gray-600 text-sm ">
              <p>Completa todos los campos para continuar</p>
            </div>

            <div className="w-full  space-y-5 mt-5">
              {/* Etiqueta y porcentaje */}
              <div className="flex justify-between mb-1 text-xs text-gray-500">
                <span>Progreso del registro</span>
                <span>{progress}%</span>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <form className="w-full space-y-3 mt-5" onSubmit={handleSubmit}>
      
                <div>
                  <InputAuth
                    icon={User}
                    iconClassName="h-6 w-6"
                    type="text"
                    placeholder="Nombre y apellidos"
                    value={fullName}
                    onChange={handleFullNameChange}
                    hasError={!!(errors.name || errors.lastname1 || errors.lastname2)}
                    error={errors.name || errors.lastname1 || errors.lastname2}
                    statusIcon={
                      errors.name || errors.lastname1 || errors.lastname2
                        ? X
                        : fullName.trim().length > 0 && isFullNameValid(formData)
                        ? Check
                        : undefined
                    }
                    statusIconClassName={
                      errors.name || errors.lastname1 || errors.lastname2
                        ? "h-5 w-5 text-red-500"
                        : fullName.trim().length > 0 && isFullNameValid(formData)
                        ? "h-5 w-5 text-green-500"
                        : ""
                    }
                  />
                </div>

               
                <div>
                  <InputAuth
                    icon={Mail}
                    iconClassName="h-6 w-6"
                    type="text"
                    placeholder="Correo electrónico"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    hasError={!!errors.email}
                    error={errors.email}
                    statusIcon={
                      formData.email.trim().length > 0
                        ? isEmailValid(formData.email)
                          ? Check
                          : X
                        : undefined
                    }
                    statusIconClassName={
                      formData.email.trim().length > 0
                        ? isEmailValid(formData.email)
                          ? "h-5 w-5 text-green-500"
                          : "h-5 w-5 text-red-500"
                        : ""
                    }
                  />
                </div>

                <div>
                  <InputAuth
                    icon={Lock}
                    iconClassName="h-6 w-6"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    hasError={!!errors.password}
                    error={errors.password}
                    endIcon={showPassword ? EyeOff : Eye}
                    endIconClassName="h-5 w-5"
                    onEndIconClick={() => setShowPassword((v) => !v)}
                    statusIcon={
                      formData.password.trim().length > 0
                        ? isPasswordValid(formData.password)
                          ? Check
                          : X
                        : undefined
                    }
                    statusIconClassName={
                      formData.password.trim().length > 0
                        ? isPasswordValid(formData.password)
                          ? "h-5 w-5 text-green-500"
                          : "h-5 w-5 text-red-500"
                        : ""
                    }
                  />
                </div>

                <div>
                  <InputAuth
                    icon={Lock}
                    iconClassName="h-6 w-6"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmar contraseña"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    hasError={!!errors.confirmPassword}
                    error={errors.confirmPassword}
                    endIcon={showConfirmPassword ? EyeOff : Eye}
                    endIconClassName="h-5 w-5"
                    onEndIconClick={() => setShowConfirmPassword((v) => !v)}
                    statusIcon={
                      formData.confirmPassword.trim().length > 0
                        ? isConfirmValid(formData.password, formData.confirmPassword)
                          ? Check
                          : X
                        : undefined
                    }
                    statusIconClassName={
                      formData.confirmPassword.trim().length > 0
                        ? isConfirmValid(formData.password, formData.confirmPassword)
                          ? "h-5 w-5 text-green-500"
                          : "h-5 w-5 text-red-500"
                        : ""
                    }
                  />
                </div>
        

              <div className="mt-7 w-full">
                <button
                  type="submit"
                  className="bg-primary text-white w-full rounded-lg p-3 cursor-pointer hover:bg-[#034078] hover:shadow-lg disabled:opacity-40 disabled:cursor-default disabled:pointer-events-none"
                  disabled={isSubmitting || progress < 100}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader className="h-5 w-5 animate-spin" />
                      Registrando...
                    </span>
                  ) : (
                    "Registrarse"
                  )}
                </button>
              </div>
            </form>

                   <div className="flex mt-7">
                <p className="text-gray-600">¿Ya tienes una cuenta?  </p>
                <Link
                  href="/login"
                  className="text-md text-primary  no-underline  hover:underline transition-colors ml-1"
                >
                  Iniciar sesión
                </Link>
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
