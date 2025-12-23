import { z } from "zod";

export const beneficiaryDetailsSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().min(1, "El correo electrónico es requerido").email("Correo electrónico inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  identityCard: z.string().min(1, "El carnet de identidad es requerido"),
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
  message: "El teléfono solo puede tener números después del código de país",
  path: ["phone"],
}).refine((data) => {
  // Validar que identityCard solo contenga números
  return data.identityCard === "" || /^\d+$/.test(data.identityCard);
}, {
  message: "El carnet de identidad solo puede tener números",
  path: ["identityCard"],
});

export type BeneficiaryDetailsFormData = z.infer<typeof beneficiaryDetailsSchema>;
