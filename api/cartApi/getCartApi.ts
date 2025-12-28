import { server_url } from "@/lib/apiClient";

export const getCartApi = async (
  userId: number,
  token: string,
  comisiones: boolean = true
) => {
  const requestBody = {
    id_user: userId,
    comisiones: comisiones,
  };

  const response = await fetch(`${server_url}/obtener_productos_carrito`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  return response;
};
