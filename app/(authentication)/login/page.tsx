"use client";

import Link from "next/link";
import { useState } from "react";
import { loginSchema, type LoginFormData } from "@/validations/loginSchema";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import InputAuth from "@/component/inputAuth/inputAuth";
import MessageErrorAuth from "@/component/messageErrorAuth/messageErrorAuth";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});

  const [showErrors, setShowErrors] = useState(false);
  const [errorBannerMessage, setErrorBannerMessage] = useState<string>("");

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const response = await fetch(
        "https://app.fadiar.com:444/prueba/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al iniciar sesión");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      const userInfo = data?.user_info ?? data?.data?.user_info ?? null;
      const access = userInfo?.access_token ?? null;
      const refresh = userInfo?.refresh_token ?? null;
      setAuth({
        email: formData.email,
        access_token: access,
        refresh_token: refresh,
      });
      router.push("/");
    },
    onError: (error) => {
      setShowErrors(true);
      setErrorBannerMessage(
        "Usuario no encontrado. Verifica tu correo electrónico."
      );
    },
  });

  const handleLoginClick = async () => {
    setShowErrors(true);
    setErrors({});
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof LoginFormData] = issue.message;
        }
      });
      setErrors(fieldErrors);
      const firstMessage = result.error.issues[0]?.message ?? "";
      setErrorBannerMessage(firstMessage);
      return;
    }
    setErrorBannerMessage("");
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  const handleChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginClick();
  };

  const isEmailValid = (email: string) =>
    loginSchema.shape.email.safeParse(email).success;
  const isFormValid =
    formData.email.trim().length > 0 &&
    formData.password.trim().length > 0 &&
    isEmailValid(formData.email);

  return (
    <div className="bg-[#e7e8e9] h-screen w-screen flex justify-center items-center">
      <div className="bg-white w-150 h-auto rounded-2xl mx-4 shadow-xl">
        <div className="p-7 my-4">
          <div className="flex justify-center items-center flex-col">
            <div>
              <h3 className="text-primary text-3xl sm:text-4xl font-bold">
                Iniciar sesión
              </h3>
            </div>

            <form
              className="w-full  space-y-5 mt-5"
              onSubmit={handleSubmitForm}
            >
              <div>
                <InputAuth
                  placeholder="Correo electrónico"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  hasError={showErrors ? !!errors.email : false}
                  hideErrorMessage
                />
              </div>

              <div>
                <InputAuth
                  placeholder="Contraseña"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  hasError={showErrors ? !!errors.password : false}
                  hideErrorMessage
                />
              </div>
            </form>

            <div className="w-full mt-5">
              {showErrors && !!errorBannerMessage && (
                <MessageErrorAuth message={errorBannerMessage} />
              )}
            </div>

            <div className="mt-3 w-full">
              <button
                className="bg-primary text-white w-full  rounded-lg p-3 cursor-pointer hover:bg-[#034078] hover:shadow-lg
              "
                onClick={handleLoginClick}
                disabled={loginMutation.isPending || !isFormValid}
              >
                {loginMutation.isPending ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader className="h-5 w-5 animate-spin" />
                    Iniciendo sesión
                  </span>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </div>

            <div className="mt-5 space-y-2 text-gray-600 text-center">
              <div className="flex">
                <p>¿No tienes una cuenta? </p>
                <Link
                  href="/register"
                  className="text-md  no-underline  hover:underline transition-colors ml-1"
                >
                  Regístrate ahora
                </Link>
              </div>

              <div>
                <Link
                  href="/verificationEmail"
                  className="text-md  no-underline  hover:underline transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <div>
                <Link
                  href="/verificationEmail"
                  className="text-md  no-underline  hover:underline transition-colors"
                >
                  ¿No has verificado tu cuenta?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
