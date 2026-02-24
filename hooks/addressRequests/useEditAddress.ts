import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../store/authStore";
import { edit_addressUrl } from "@/urlApi/urlApi";
import { refreshToken } from "@/utils/refreshToken";
import SuccesMessage from "@/messages/succesMessage";
import ErrorMessage from "@/messages/errorMessage";

export const useEditAddress = () => {
  const { auth, setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  const editAddress = async ({
    id_direccion,
    municipio,
    direccion,
  }: {
    id_direccion: string;
    municipio: string;
    direccion: string;
  }) => {
    if (!auth) throw new Error("No hay sesión activa");
    
    const currentAccessToken = await refreshToken(auth, setAuth);
    
    const response = await fetch(edit_addressUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentAccessToken}`,
      },
      body: JSON.stringify({
        id_direccion,
        municipio,
        direccion,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error al editar la dirección");
    }

    return response.json();
  };

  const { mutate: editAddressMutation, isPending } = useMutation({
    mutationFn: editAddress,
    onSuccess: () => {
      SuccesMessage("Dirección editada correctamente");
      queryClient.invalidateQueries({ queryKey: ["addresses", auth?.user.id] });
    },
    onError: (error: any) => {
      ErrorMessage(error.message);
    },
  });

  return {
    editAddressMutation,
    isPending,
  };
};
