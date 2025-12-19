import { z } from "zod";

export const cart1Schema = z.object({
  phoneValue: z.string().min(1, "El teléfono es requerido"),
  countryCode: z.string().min(1, "El código de país es requerido"),
  identityCard: z.string().min(1, "El carnet de identidad es requerido"),
  province: z.string().min(1, "La provincia es requerida"),
  municipality: z.string().min(1, "El municipio es requerido"),
}).refine((data) => {
  // Validar que phoneValue solo contenga números
  return data.phoneValue === "" || /^\d+$/.test(data.phoneValue);
}, {
  message: "Solo números",
  path: ["phoneValue"],
}).refine((data) => data.identityCard === "" || /^\d+$/.test(data.identityCard), {
  message: "Solo números",
  path: ["identityCard"],
});

export type Cart1FormData = z.infer<typeof cart1Schema>;
