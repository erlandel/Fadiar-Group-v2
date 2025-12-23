import { z } from "zod";

export const buyerDetailsSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().min(1, "El correo electrónico es requerido").email("Correo electrónico inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  note: z.string().optional(),
}).refine((data) => {
  // Validar que firstName solo contenga letras
  return data.firstName === "" || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.firstName);
}, {
  message: "El nombre solo puede contener letras",
  path: ["firstName"],
}).refine((data) => {
  // Validar que lastName solo contenga letras
  return data.lastName === "" || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.lastName);
}, {
  message: "El apellido solo puede contener letras",
  path: ["lastName"],
}).refine((data) => {
  // Validar formato "+XX YYYYYYYY"
  const parts = data.phone.trim().split(" ");
  if (parts.length < 2) return false;
  const number = parts.slice(1).join("");
  return number === "" || /^\d+$/.test(number);
}, {
  message: "Solo números después del código de país",
  path: ["phone"],
});

export type BuyerDetailsFormData = z.infer<typeof buyerDetailsSchema>;
