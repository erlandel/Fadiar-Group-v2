import { server_url } from "@/lib/apiClient";

export const updateCartApi = async (
  userId: number,
  productId: string | number,
  tiendaId: string | number | undefined,
  newCount: number,
  token: string
) => {
  const requestBody = {
    id_user: userId,
    id_product: productId,
    id_tienda: tiendaId,
    newCount: newCount,
    emisor: "web",
  };

  const response = await fetch(`${server_url}/modificar_cantidad_producto_carrito`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  console.log("modificar_cantidad_producto_carrito:", response);
  return response;
};
