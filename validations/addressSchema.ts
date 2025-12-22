import { z } from "zod";

export const addressSchema = z.object({
  address: z.string().min(1, { message: "La dirección es requerida" }),
});

export type AddressFormData = z.infer<typeof addressSchema>;
