import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const beneficiaryDetailsSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().min(1, "El correo electrónico es requerido").email("Correo electrónico inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  identityCard: z.string().min(1, "El carnet de identidad es requerido"),
})
  .superRefine((data, ctx) => {
    // Validar que firstName solo contenga letras
    if (data.firstName !== "" && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.firstName)) {
      ctx.addIssue({
        code: "custom",
        message: "El nombre solo puede contener letras",
        path: ["firstName"],
      });
    }

    // Validar que lastName solo contenga letras
    if (data.lastName !== "" && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.lastName)) {
      ctx.addIssue({
        code: "custom",
        message: "El apellido solo puede contener letras",
        path: ["lastName"],
      });
    }

    // Validar formato de teléfono permitiendo espacios
    const phone = data.phone.trim();
    if (phone !== "") {
      if (!/^\+[\d\s]+$/.test(phone)) {
        ctx.addIssue({
          code: "custom",
          message: "El teléfono solo puede contener el '+' del código, números y espacios",
          path: ["phone"],
        });
      } else {
        const phoneNumber = parsePhoneNumberFromString(phone);
        if (!phoneNumber || !phoneNumber.isValid()) {
          let errorMessage = "Número de teléfono no válido";
          const parts = phone.split(" ");
          const hasNumber = parts.length > 1 && parts[1].trim().length > 0;

          if (!hasNumber) {
            errorMessage = "Debe ingresar el número de teléfono completo";
          } else if (phoneNumber) {
            if (!phoneNumber.isPossible()) {
              errorMessage = "Número de teléfono no es posible para este país";
            } else {
              errorMessage = "Número de teléfono inválido (longitud incorrecta)";
            }
          } else {
            errorMessage = "Formato de teléfono incorrecto";
          }

          ctx.addIssue({
            code: "custom",
            message: errorMessage,
            path: ["phone"],
          });
        }
      }
    }

    // Validar que identityCard solo contenga números
    if (data.identityCard !== "" && !/^\d+$/.test(data.identityCard)) {
      ctx.addIssue({
        code: "custom",
        message: "El carnet de identidad solo puede tener números",
        path: ["identityCard"],
      });
    }
  });

export type BeneficiaryDetailsFormData = z.infer<typeof beneficiaryDetailsSchema>;
