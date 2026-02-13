import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "@/store/authStore";
import { refreshToken } from "@/utils/refreshToken";
import { add_orderUrl } from "@/urlApi/urlApi";
import ErrorMessage from "@/messages/errorMessage";
import SuccesMessage from "@/messages/succesMessage";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import MatterCart1Store from "@/store/matterCart1Store";
import cartStore from "@/store/cartStore";
import BuyerDetailsStore from "@/store/buyerDetailsStore";

export const useConfirmOrder = () => {
  const router = useRouter();
  const formData = MatterCart1Store((state) => state.formData);
  const { municipalityId } = useProductsByLocationStore();
  const clearCart = cartStore((state) => state.clearCart);
  const updateFormData = MatterCart1Store((state) => state.updateFormData);
  const { paymentMethod } = BuyerDetailsStore((state) => state.buyerDetails);

  const confirmOrderMutation = useMutation({
    mutationFn: async () => {
      const { auth, setAuth } = useAuthStore.getState();

      if (!auth?.access_token) {
        router.push("/login");   
      }
 

      const token = await refreshToken(auth, setAuth);

      if (!token) {
        ErrorMessage("No se pudo obtener una sesión válida");
      }

      const use_user_info= true;

      const requestBody = {
        name_cliente: formData.firstName,
        last_names: `${formData.lastName1} ${formData.lastName2}`.trim(),
        cellphone_cliente: formData.phone,
        id_municipio: municipalityId,
        direccionExacta: formData.delivery ? (formData.address || "") : "",
        emisor: "web",
        use_user_info,
        nota: formData.note || "",
       paymentMethod,
      };

      console.log("requestBody en confirmar orden: ", requestBody);
      const response = await fetch(`${add_orderUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg =errorData.error || errorData.message || "No se pudo confirmar la orden";
        ErrorMessage(msg);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log("Respuesta del backend (agregar pedido):", data);
      
      const orderId = data.orders?.[0]?.id;
      
      SuccesMessage(`Orden confirmada correctamente`);

      const isDelivery = formData.delivery;

      // Limpiar carrito y solo las tiendas del formulario tras éxito
      clearCart();
      updateFormData({
        stores: [],
        showDeliveryOverlay: true,
        overlayDelivery: isDelivery,
        delivery: false,
        orderId: orderId || "",
      });

    

      // Redirigir al inicio o a una página de éxito
      router.push("/orders");
    },
    onError: (error: any) => {
      console.error("Error al confirmar la orden:", error);    
    },
  });

  return {
    confirmOrder: confirmOrderMutation.mutate,
    isLoading: confirmOrderMutation.isPending,
    isError: confirmOrderMutation.isError,
    error: confirmOrderMutation.error,
  };
};
