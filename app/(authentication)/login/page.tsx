"use client";

import Link from "next/link";
import { useState } from "react";
import { loginSchema, type LoginFormData } from "@/validations/loginSchema";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import InputAuth from "@/components/inputAuth/inputAuth";
import MessageErrorAuth from "@/components/messageErrorAuth/messageErrorAuth";
import { useMutation } from "@tanstack/react-query";
import { Loader, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginUrl } from "@/urlApi/urlApi";

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
  const [showPassword, setShowPassword] = useState(false);
  const [errorBannerMessage, setErrorBannerMessage] = useState<string>("");
  const [editedFields, setEditedFields] = useState<
    Partial<Record<keyof LoginFormData, boolean>>
  >({});

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const response = await fetch(
       `${loginUrl}`,
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
        const message =
          (errorData as { error?: string; message?: string })?.error ||
          (errorData as { error?: string; message?: string })?.message ||
          "Error al iniciar sesión";
        throw new Error(message);
      }
      const data = await response.json();
    
      return data;
    },
 onSuccess: (data) => {
  const userInfo =
    data?.user_info ??
    data?.data?.user_info ??
    null;

    

  if (!userInfo) return;

  setAuth({
    person: userInfo.person,
    user: userInfo.user,
    type: userInfo.type,
    access_token: userInfo.access_token,
    refresh_token: userInfo.refresh_token,
  });

  router.push("/");
},
    onError: (error: Error) => {
      setShowErrors(true);
      if (error.message === "Su cuenta no ha sido verificada") {
        localStorage.setItem("verificationEmail", formData.email);
        router.push("/verificationCodeEmail");
        return;
      }
      setErrorBannerMessage(
        error.message || "Usuario no encontrado. Verifica tu correo electrónico."
      );
    },
  });

  const handleLoginClick = async () => {
    setShowErrors(true);
    setErrors({});
    setEditedFields({});
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
      setEditedFields((prev) => ({ ...prev, [field]: true }));
    };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginClick();
  };

  const isEmailValid = (email: string) =>
    loginSchema.shape.email.safeParse(email).success;

  return (
    <div className="bg-[#e7e8e9] min-h-dvh w-full flex items-center justify-center overflow-hidden">
      <div className="bg-white w-120 h-auto rounded-2xl mx-4 shadow-xl">
        <div className="px-7 py-5 ">
          <div className="flex justify-center items-center flex-col">
            <div>
              <h3 className="text-primary text-2xl sm:text-3xl font-bold">
                Iniciar sesión
              </h3>
            </div>

            <form
              className="w-full  space-y-4 mt-5"
              onSubmit={handleSubmitForm}
            >
              <div>
                <InputAuth
                  icon={Mail}
                  iconClassName="h-6 w-6"
                  placeholder="Correo electrónico"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  hasError={showErrors ? (!!errors.email && !editedFields.email) : false}
                  hideErrorMessage
                />
              </div>

              <div>
                <InputAuth
                  icon={Lock}
                  iconClassName="h-6 w-6"
                  placeholder="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  hasError={showErrors ? (!!errors.password && !editedFields.password) : false}
                  hideErrorMessage
                  endIcon={showPassword ? EyeOff : Eye}
                  endIconClassName="h-5 w-5"
                  onEndIconClick={() => setShowPassword((v) => !v)}
                />
              </div>
            </form>

            {showErrors && !!errorBannerMessage && (
              <div className="w-full mt-5">
                <MessageErrorAuth message={errorBannerMessage} />
              </div>
            )}

            <div className="mt-5 w-full">
              <button
                className="bg-primary text-white w-full  rounded-lg px-3 py-2 cursor-pointer hover:bg-[#034078] hover:shadow-lg  disabled:opacity-40 disabled:cursor-default disabled:pointer-events-none
              "
                onClick={handleLoginClick}
                disabled={loginMutation.isPending}
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

            <div className="mt-6 space-y-2   text-primary text-center text-xs sm:text-sm">
              <div className="flex">
                <p className="text-gray-600">¿No tienes una cuenta? </p>
                <Link
                  href="/register"
                  className=" no-underline  hover:underline transition-colors ml-1"
                >
                  Regístrate ahora
                </Link>
              </div>

              <div>
                <Link
                  href="/recoverPassword"
                  className="  no-underline  hover:underline transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <div>
                <Link
                  href="/enterEmail"
                  className="  no-underline  hover:underline transition-colors"
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
