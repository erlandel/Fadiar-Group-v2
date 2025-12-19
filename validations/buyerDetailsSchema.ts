import { z } from "zod";

export const buyerDetailsSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().min(1, "El correo electrónico es requerido").email("Correo electrónico inválido"),
  phoneValue: z.string().min(1, "El teléfono es requerido"),
  phoneCountry: z.string().min(1, "El código de país es requerido"),
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
  // Validar que phoneValue solo contenga números
  return data.phoneValue === "" || /^\d+$/.test(data.phoneValue);
}, {
  message: "Solo números",
  path: ["phoneValue"],
});

export type BuyerDetailsFormData = z.infer<typeof buyerDetailsSchema>;
