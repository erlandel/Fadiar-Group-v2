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

    const response = await fetch(`${delete_addressUrl}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentAccessToken}`,
      },
      body: JSON.stringify({ id: addressId }),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la dirección");
    }

    return response.json();
  };

  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      SuccesMessage("Dirección eliminada correctamente");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: () => {
      ErrorMessage("Error al eliminar la dirección");
    },
  });

  return {
    deleteAddress: deleteAddressMutation.mutate,
    isDeleting: deleteAddressMutation.isPending,
  };
};
