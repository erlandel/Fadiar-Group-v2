import { z } from "zod";

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
    .refine((val) => {
      const parts = val.trim().split(" ");
      if (parts.length < 2) return false;
      const number = parts.slice(1).join("");
      return number === "" || /^\d+$/.test(number);
    }, {
      message: "El teléfono debe tener un código de país seguido de un espacio y números",
    }),
});

export type PersonalDataFormData = z.infer<typeof personalDataSchema>;
