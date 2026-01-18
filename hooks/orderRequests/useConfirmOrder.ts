import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { refreshToken } from "@/utils/refreshToken";
import { add_orderUrl } from "@/urlApi/urlApi";
import ErrorMessage from "@/messages/errorMessage";
import SuccesMessage from "@/messages/succesMessage";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import MatterCart1Store from "@/store/matterCart1Store";
import cartStore from "@/store/cartStore";

export const useConfirmOrder = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formData = MatterCart1Store((state) => state.formData);
  const { municipalityId } = useProductsByLocationStore();
  const clearCart = cartStore((state) => state.clearCart);
  const updateFormData = MatterCart1Store((state) => state.updateFormData);

  const confirmOrder = async () => {
    const { auth, setAuth } = useAuthStore.getState();

    if (!auth?.access_token) {
      router.push("/login");
      return;
    }

    if (!municipalityId) {
      ErrorMessage("Debe seleccionar un municipio antes de confirmar la orden");
      return;
    }

    if (!formData.identityCard || !formData.firstName || !formData.phone) {
      ErrorMessage("Faltan datos del beneficiario para confirmar la orden");
      return;
    }

    setLoading(true);

    try {
      const token = await refreshToken(auth, setAuth);

      if (!token) {
        ErrorMessage("No se pudo obtener una sesión válida");
        return;
      }

      const requestBody = {
        ci_cliente: formData.identityCard,
        name_cliente: formData.firstName,
        last_names: `${formData.lastName1} ${formData.lastName2}`.trim(),
        cellphone_cliente: formData.phone,
        id_municipio: municipalityId,
        direccionExacta: formData.address || null,
        emisor: "web",
      };

      const response = await fetch(`${add_orderUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta del backend (agregar pedido):", data);
         SuccesMessage("Orden confirmada correctamente");
        
        // Limpiar carrito y solo las tiendas del formulario tras éxito
        clearCart();
        updateFormData({ stores: [] });
        
        // Redirigir al inicio o a una página de éxito (opcional, por ahora lo dejo así)
         router.push("/orders");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("El backend rechazó la petición de orden:", errorData);
        const msg =
          errorData.error || errorData.message || "No se pudo confirmar la orden";
        ErrorMessage(msg);
      }
    } catch (error) {
      console.error("Error al confirmar la orden:", error);
      ErrorMessage("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return { confirmOrder, loading };
};
