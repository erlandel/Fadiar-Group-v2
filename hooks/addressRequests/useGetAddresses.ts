import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../store/authStore";
import { get_addressesUrl } from "@/urlApi/urlApi";
import { refreshToken } from "@/utils/refreshToken";


export const useGetAddresses = () => {
  const { auth, setAuth } = useAuthStore();

  const fetchAddresses = async () => {
    if (!auth) return [];

    const currentAccessToken = await refreshToken(auth, setAuth);

    const response = await fetch(get_addressesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentAccessToken}`,
      },
      body: JSON.stringify({ id_user: auth.user.id }),
    });

    if (!response.ok) {
      throw new Error("Error al obtener las direcciones");
    }

    const data = await response.json();
    console.log("Respuesta del backend (obtener direcciones):", data);

    let addresses = [];
    if (data && data.listado && Array.isArray(data.listado)) {
      addresses = data.listado;
    } else if (Array.isArray(data)) {
      addresses = data;
    }

    // Mapeamos los datos para que personalData pueda mostrarlos
    // El backend devuelve 'to_jsonb' con el nombre del municipio
    return addresses.map((addr: any) => ({
      ...addr,
      municipio: addr.to_jsonb || addr.municipio, 
      provincia: addr.provincia // Asumimos que viene en la respuesta según indicación
    }));
  };

  const {
    data: addresses,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["addresses", auth?.user?.id],
    queryFn: fetchAddresses,
    enabled: !!auth?.user?.id,
  });

  return {
    addresses: addresses || [],
    isLoading,
    isError,
    refetch,
  };
};
