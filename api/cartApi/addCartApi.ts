import { server_url } from "@/lib/apiClient";

export const addCartApi = async (
  productId: string | number,
  tiendaId: string | number | undefined,
  quantity: number,
  token: string
) => {
  const requestBody = {
    id_product: productId,
    id_tienda: tiendaId,
    count: quantity,
    emisor: "web",
  };

  const response = await fetch(`${server_url}/agregar_producto_carrito`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  return response;
};
