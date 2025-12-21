import { z } from "zod";

export const recoverPasswordSchema = z.object({
  email: z.string().min(1, "Por favor ingresa tu correo electrónico").pipe(z.email("Debe ser un correo válido")),

});

export type RecoverPasswordSchemaFormData = z.infer<typeof recoverPasswordSchema>;
