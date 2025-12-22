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
    .regex(/^[0-9]+$/, "El teléfono solo puede contener números"),
});

export type PersonalDataFormData = z.infer<typeof personalDataSchema>;
