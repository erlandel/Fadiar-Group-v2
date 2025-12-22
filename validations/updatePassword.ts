import { z } from "zod";

export const updatePasswordSchema = z.object({
  password: z.string().min(1, { message: "La contraseña actual es requerida" }),
  confirmPassword: z.string().min(6, { message: "Debe tener al menos 6 caracteres" }),
});

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
