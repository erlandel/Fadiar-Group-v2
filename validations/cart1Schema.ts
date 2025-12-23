import { z } from "zod";

export const cart1Schema = z.object({
  phone: z.string().min(1, "El teléfono es requerido"),
  identityCard: z.string().min(1, "El carnet de identidad es requerido"),
  province: z.string().min(1, "La provincia es requerida"),
  municipality: z.string().min(1, "El municipio es requerido"),
}).refine((data) => {
  // Validar formato "+XX YYYYYYYY" o similar (código país, espacio, número)
  const phoneParts = data.phone.trim().split(" ");
  if (phoneParts.length < 2) return false;
  const [code, number] = phoneParts;
  return number === "" || /^\d+$/.test(number);
}, {
  message: "Número de teléfono inválido (debe contener solo números después del código de país)",
  path: ["phone"],
}).refine((data) => data.identityCard === "" || /^\d+$/.test(data.identityCard), {
  message: "Solo números",
  path: ["identityCard"],
});

export type Cart1FormData = z.infer<typeof cart1Schema>;
