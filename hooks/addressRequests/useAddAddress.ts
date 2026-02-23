import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../store/authStore";
import { add_addressUrl } from "@/urlApi/urlApi";
import { refreshToken } from "@/utils/refreshToken";
import SuccesMessage from "@/messages/succesMessage";
import ErrorMessage from "@/messages/errorMessage";

export const useAddAddress = () => {
  const { auth, setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  const addAddress = async ({ address, municipalityId }: { address: string; municipalityId: string }) => {
    if (!auth) throw new Error("No hay sesión activa");
    
    const currentAccessToken = await refreshToken(auth, setAuth);
    
    const response = await fetch(add_addressUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentAccessToken}`,
      },
      body: JSON.stringify({ 
        id_user: auth.user.id, 
        municipio: municipalityId,
        direccion: address 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error al añadir la dirección");
    }

    console.log("Respuesta del backend (añadir dirección):", response);
    return response.json();
  };

  const { mutate: addAddressMutation, isPending } = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      SuccesMessage("Dirección añadida correctamente");
      queryClient.invalidateQueries({ queryKey: ["addresses", auth?.user.id] });
    },
    onError: (error: any) => {
      ErrorMessage(error.message);
    },
  });

  return {
    addAddressMutation,
    isPending,
  };
};
