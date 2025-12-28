import { server_url } from "@/lib/apiClient";

export const deleteCartApi = async (cartId: number, token: string) => {
  // console.log("datos antes del envio",cartId,token)
  const response = await fetch(
    `${server_url}/eliminar_producto_carrito`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_carrito: cartId,
        emisor: "web",
      }),
    }
  );

  return response;
};

