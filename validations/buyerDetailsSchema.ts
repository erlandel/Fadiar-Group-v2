import { z } from "zod";

export const buyerDetailsSchema = z.object({
  firstName: z
    .string()
    .min(1, "El nombre es requerido")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Error de escritura "),
  lastName1: z
    .string()
    .min(1, "El primer apellido es requerido")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Error de escritura"),
  lastName2: z
    .string()
    .min(1, "El segundo apellido es requerido")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Error de escritura" ),
  email: z.string().min(1, "El correo electrónico es requerido").email("Correo electrónico inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  note: z.string().optional(),
}).refine((data) => {
  // Validar formato "+XX YYYYYYYY"
  const parts = data.phone.trim().split(" ");
  if (parts.length < 2) return false;
  const number = parts.slice(1).join("");
  return number === "" || /^\d+$/.test(number);
}, {
  message: "Solo números",
  path: ["phone"],
});

export type BuyerDetailsFormData = z.infer<typeof buyerDetailsSchema>;
