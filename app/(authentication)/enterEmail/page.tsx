"use client";
import InputAuth from "@/components/inputAuth/inputAuth";
import MessageErrorAuth from "@/components/messageErrorAuth/messageErrorAuth";
import { RecoverPasswordSchemaFormData, recoverPasswordSchema } from "@/validations/recoverPasswordSchema";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EnterEmail() {
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




  const handleChange =
    (field: keyof RecoverPasswordSchemaFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setEditedFields((prev) => ({ ...prev, [field]: true }));
    };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      recoverPasswordSchema.parse(formData);
      setErrors({});
      setShowErrors(false);
      setErrorBannerMessage("");
      localStorage.setItem("verificationEmail", formData.email);
      router.push("/verificationCodeEmail");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof RecoverPasswordSchemaFormData, string>> = {};
        for (const issue of error.issues) {
          newErrors[issue.path[0] as keyof RecoverPasswordSchemaFormData] = issue.message;
        }
        setErrors(newErrors);
        setShowErrors(true);
        setErrorBannerMessage("Por favor corrige los errores en el formulario.");
      }
    }
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
                 Verificar cuenta
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
                  hasError={showErrors && !!errors.email}
                  hideErrorMessage={false}
                />
                {showErrors && errors.email && (
                  <MessageErrorAuth message={errors.email} />
                )}
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
                onClick={handleSubmitForm}
                disabled={!isFormValid}
              >
                Verificar cuenta
              </button>
            </div>

            <div className="mt-6 space-y-2   text-primary text-center text-xs sm:text-sm">
              <div className="flex">      
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
