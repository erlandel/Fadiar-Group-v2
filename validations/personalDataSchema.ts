import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const personalDataSchema = z.object({
  firstName: z
    .string()
    .min(1, "El nombre es requerido")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "El nombre solo puede contener letras"),
  lastName: z
    .string()
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Los apellidos solo pueden contener letras")
    .refine(
      (val) => {
        const parts = val.trim().split(/\s+/);
        return parts.length >= 2;
      },
      {
        message: "Debe ingresar ambos apellidos",
      }
    ),
  email: z.string().min(1, "El correo es requerido").pipe(z.email("Debe ser un correo válido")),
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .superRefine((val, ctx) => {
      const phone = val.trim();
      
      // Permitir '+' inicial seguido de números y espacios
      if (!/^\+[\d\s]+$/.test(phone)) {
        ctx.addIssue({
          code: "custom",
          message: "El teléfono solo puede contener el '+' del código, números y espacios",
        });
        return;
      }

      const phoneNumber = parsePhoneNumberFromString(phone);

      if (!phoneNumber || !phoneNumber.isValid()) {
        const parts = phone.split(" ");
        const hasNumber = parts.length > 1 && parts[1].trim().length > 0;

        if (!hasNumber) {
          ctx.addIssue({
            code: "custom",
            message: "Debe ingresar el número de teléfono completo",
          });
        } else if (phoneNumber) {
          if (!phoneNumber.isPossible()) {
            ctx.addIssue({
              code: "custom",
              message: "Número de teléfono no es posible para este país",
            });
          } else {
            ctx.addIssue({
              code: "custom",
              message: "Número de teléfono inválido (longitud incorrecta)",
            });
          }
        } else {
          if (!phone.startsWith("+")) {
            ctx.addIssue({
              code: "custom",
              message: "Falta el código de país (debe empezar con +)",
            });
          } else {
            ctx.addIssue({
              code: "custom",
              message: "Formato de teléfono incorrecto",
            });
          }
        }
      }
    }),
});

export type PersonalDataFormData = z.infer<typeof personalDataSchema>;
