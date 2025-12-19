import { z } from "zod";

export const deliveryMethodSchema = z.object({
  address: z.string().min(1, "La dirección es requerido").min(5, "La dirección debe tener al menos 5 caracteres"),
  note: z.string().optional(),
});

export type DeliveryMethodFormData = z.infer<typeof deliveryMethodSchema>;
