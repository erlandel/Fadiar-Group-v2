import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../store/authStore";
import { delete_addressUrl } from "@/urlApi/urlApi";
import { refreshToken } from "@/utils/refreshToken";
import SuccesMessage from "@/messages/succesMessage";
import ErrorMessage from "@/messages/errorMessage";

export const useDeleteAddress = () => {
  const { auth, setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  const deleteAddress = async (addressId: string) => {
    if (!auth) throw new Error("No hay sesión activa");
    
    const currentAccessToken = await refreshToken(auth, setAuth);
    
    const response = await fetch(delete_addressUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentAccessToken}`,
      },
      body: JSON.stringify({ 
        id_direccion: addressId 
      }),
    });

    console.log("Respuesta del backend (eliminar dirección):", response);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error al eliminar la dirección");
    }

    return response.json();
  };

  const { mutate: deleteAddressMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      SuccesMessage("Dirección eliminada correctamente");
      queryClient.invalidateQueries({ queryKey: ["addresses", auth?.user.id] });
    },
    onError: (error: any) => {
      ErrorMessage(error.message);
    },
  });

  return {
    deleteAddressMutation,
    isDeleting,
  };
};
