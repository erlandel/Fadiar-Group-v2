"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import cartStore from "@/store/cartStore";
import MatterCart1Store from "@/store/matterCart1Store";
import PayerPaymentDetails from "./payerPaymentDetails";
import RecipientPaymentDetails from "./recipientPaymentDetails";
import ProductListConfirmation from "./productListConfirmation";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { refreshToken } from "@/utils/refreshToken";
import { add_orderUrl } from "@/urlApi/urlApi";
import ErrorMessage from "@/messages/errorMessage";
import SuccesMessage from "@/messages/succesMessage";
import useProductsByLocationStore from "@/store/productsByLocationStore";

export default function PaymentConfirmation() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const totalPrice = cartStore((state) => state.getTotalPrice());
  const formData = MatterCart1Store((state) => state.formData);
  const clearCart = cartStore((state) => state.clearCart);
  const updateFormData = MatterCart1Store((state) => state.updateFormData);
  const { municipalityId } = useProductsByLocationStore();

  const confirmOrderMutation = useMutation({
    mutationFn: async () => {
      const { auth, setAuth } = useAuthStore.getState();

      if (!auth?.access_token) {
        router.push("/login");
        throw new Error("No hay sesión activa");
      }

      if (!municipalityId) {
        ErrorMessage("Debe seleccionar un municipio antes de confirmar la orden");
        throw new Error("Municipio no seleccionado");
      }

      if (!formData.identityCard || !formData.firstName || !formData.phone) {
        ErrorMessage("Faltan datos del beneficiario para confirmar la orden");
        throw new Error("Faltan datos del beneficiario");
      }

      const token = await refreshToken(auth, setAuth);

      if (!token) {
        ErrorMessage("No se pudo obtener una sesión válida");
        throw new Error("Sesión inválida");
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.error || errorData.message || "No se pudo confirmar la orden";
        ErrorMessage(msg);
        throw new Error(msg);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log("Respuesta del backend (agregar pedido):", data);
      SuccesMessage("Orden confirmada correctamente");
      clearCart();
      updateFormData({ stores: [] });
      router.push("/orders");
    },
    onError: (error) => {
      console.error("Error al confirmar la orden:", error);
      if (error.message !== "No hay sesión activa" && 
          error.message !== "Municipio no seleccionado" && 
          error.message !== "Faltan datos del beneficiario" && 
          error.message !== "Sesión inválida") {
        ErrorMessage("Error de conexión con el servidor");
      }
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className="md:col-span-2 xl:col-span-1">
          <ProductListConfirmation />
        </div>

        <div className="w-full max-w-120 mx-auto md:mx-0">
          <RecipientPaymentDetails />
        </div>

        <div className="w-full max-w-120 mx-auto md:mx-0">
          <div>
            <PayerPaymentDetails />
          </div>

          <div className=" mt-10">
            <div>
              <h5 className="text-primary font-bold text-xl ml-4 pb-1">IMPORTE</h5>
              <div className="w-full  border-b-2 border-gray"></div>
            </div>

            <div>
              <div className="mb-4 mt-4 ">
                <div className="bg-[#F5F7FA] rounded-xl overflow-hidden">
                  {mounted && formData.delivery && (
                    <div className="p-4 space-y-6">
                      <div className="flex justify-between items-center  text-[#022954]">
                        <span className="text-md">Subtotal:</span>
                        <span className="font-medium">
                          $ {totalPrice.toFixed(2)} USD
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-[#022954]">
                          <span className="text-md">Domicilio:</span>
                          <span className="font-medium whitespace-nowrap text-xl">
                            $ {(formData.deliveryPrice || 0).toFixed(2)} USD
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-2 py-4  bg-[#E2E6EA]">
                    <span className="font-bold text-[#022954] text-2xl">
                      Total
                    </span>
                    <span className="text-xl font-bold text-[#022954]">
                      $ {(mounted ? totalPrice + (formData.delivery ? (formData.deliveryPrice || 0) : 0) : 0).toFixed(2)}{" "}
                      <span className="text-2xl font-normal">USD</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between space-x-2">
              <div className="w-full">
                <button
                  className="bg-white text-primary border border-primary py-4 w-full font-semibold rounded-xl hover:scale-103 transition cursor-pointer"
                  onClick={() => router.push("/cart2")}
                >
                  Atrás
                </button>
              </div>
              <div className="w-full">
                <button
                  className="bg-[#022954] text-white py-4 w-full font-semibold rounded-xl hover:scale-103 transition cursor-pointer hover:bg-[#034078] hover:shadow-lg  disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => confirmOrderMutation.mutate()}
                  disabled={confirmOrderMutation.isPending}
                >
                  {confirmOrderMutation.isPending ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader className="h-5 w-5 animate-spin" />
                      Confirmando...
                    </span>
                  ) : (
                    "Confirmar"
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>


      </div>
    </>
  );
}
