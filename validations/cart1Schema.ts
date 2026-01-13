import { z } from "zod";

export const cart1Schema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName1: z.string().min(1, "El primer apellido es requerido"),
  lastName2: z.string().min(1, "El segundo apellido es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  identityCard: z.string().min(1, "El carnet de identidad es requerido"),
  province: z.string().min(1, "La provincia es requerida"),
  municipality: z.string().min(1, "El municipio es requerido"),
  delivery: z.boolean(),
  address: z.string().optional(),
}).refine((data) => {
  if (data.delivery && (!data.address || data.address.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "La dirección es requerida para entrega a domicilio",
  path: ["address"],
}).refine((data) => {
  // Validar que firstName solo contenga letras
  return data.firstName === "" || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.firstName);
}, {
  message: "El nombre solo puede contener letras",
  path: ["firstName"],
}).refine((data) => {
  // Validar que lastName1 solo contenga letras
  return data.lastName1 === "" || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.lastName1);
}, {
  message: "El primer apellido solo puede contener letras",
  path: ["lastName1"],
}).refine((data) => {
  // Validar que lastName2 solo contenga letras
  return data.lastName2 === "" || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.lastName2);
}, {
  message: "El segundo apellido solo puede contener letras",
  path: ["lastName2"],
}).refine((data) => {
  // Validar formato "+XX YYYYYYYY" o similar (código país, espacio, número)
  const phoneParts = data.phone.trim().split(" ");
  if (phoneParts.length < 2) return false;
  const number = phoneParts.slice(1).join("");
  return number === "" || /^\d+$/.test(number);
}, {
  message: "Número de teléfono inválido",
  path: ["phone"],
}).refine((data) => data.identityCard === "" || /^\d+$/.test(data.identityCard), {
  message: "Solo números",
  path: ["identityCard"],
});

export type Cart1FormData = z.infer<typeof cart1Schema>;
