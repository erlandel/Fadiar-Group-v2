"use client";
import InputAuth from "@/component/inputAuth/inputAuth";
import MessageErrorAuth from "@/component/messageErrorAuth/messageErrorAuth";
import { RecoverPasswordSchemaFormData, recoverPasswordSchema } from "@/validations/recoverPasswordSchema";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RecoverPassword() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<RecoverPasswordSchemaFormData>({
    email: "",
    
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RecoverPasswordSchemaFormData, string>>
  >({});

  const [showErrors, setShowErrors] = useState(false);
  const [errorBannerMessage, setErrorBannerMessage] = useState<string>("");
  const [editedFields, setEditedFields] = useState<
    Partial<Record<keyof RecoverPasswordSchemaFormData, boolean>>
  >({});

  const loginMutation = useMutation({    
    mutationFn: async (payload: { email: string }) => {
      console.log("email: "+payload.email);
      const response = await fetch(
        "https://app.fadiar.com:444/prueba/api/recuperar_credenciales_por_correo",
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
        throw new Error(errorData.message || "Error en la solicitud");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      router.push("/login");
    },

    onError: () => {
      setShowErrors(true);
      setErrorBannerMessage(
        "Usuario no encontrado. Verifica tu correo electrónico."
      );
    },
  });


  const handleLoginClick = async () => {
    setShowErrors(true);
    setErrors({});
    setEditedFields({});
    const result = recoverPasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RecoverPasswordSchemaFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof RecoverPasswordSchemaFormData] = issue.message;
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
    });
  };

  const handleChange =
    (field: keyof RecoverPasswordSchemaFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setEditedFields((prev) => ({ ...prev, [field]: true }));
    };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginClick();
  };

  const isEmailValid = (email: string) =>
    recoverPasswordSchema.shape.email.safeParse(email).success;
  const isFormValid =
    formData.email.trim().length > 0 &&  
    isEmailValid(formData.email);

  return (
    <div className="bg-[#e7e8e9] min-h-dvh w-full flex items-center justify-center overflow-hidden">
      <div className="bg-white w-120 h-auto rounded-2xl mx-4 shadow-xl">
        <div className="px-7 py-5 ">
          <div className="flex justify-center items-center flex-col">
            <div>
              <h3 className="text-primary text-2xl sm:text-3xl font-bold">
                Recuperar contraseña
              </h3>
            </div>

            <form
              className="w-full  space-y-4 mt-5"
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
                  hasError={
                    showErrors ? !!errors.email && !editedFields.email : false
                  }
                  hideErrorMessage
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
                className="bg-primary text-white w-full  rounded-lg px-3 py-2 cursor-pointer hover:bg-[#034078] hover:shadow-lg
              "
                onClick={handleLoginClick}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader className="h-5 w-5 animate-spin" />
                    Recuperar contraseña
                  </span>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </div>

            <div className="mt-6 space-y-2   text-primary text-center text-xs sm:text-sm">
              <div className="flex">
                <p className="text-gray-600">¿Recuerdas tu contraseña? </p>
                <Link
                  href="/login"
                  className=" no-underline  hover:underline transition-colors ml-1"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
