import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Por favor ingresa tu correo electrónico").pipe(z.email("Debe ser un correo válido")),
  password: z.string().min(1, "Por favor ingresa tu contraseña"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
