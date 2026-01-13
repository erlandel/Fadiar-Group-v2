"use client";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputField } from "../inputField/inputField";
import PhoneInput from "../phoneInput/phoneInput";
import { cart1Schema } from "../../validations/cart1Schema";
import { useStore } from "zustand";
import cartStore from "../../store/cartStore";
import MatterCart1Store, {
  FormData as MatterFormData,
} from "@/store/matterCart1Store";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import useAuthStore from "@/store/authStore";

export default function Amount() {
  const router = useRouter();
  const { auth } = useAuthStore();
  const { province: storeProvince, municipality: storeMunicipality } =
    useProductsByLocationStore();

  const fullName = auth?.person
    ? `${auth.person.name} ${auth.person.lastname1} ${auth.person.lastname2}`
    : "";
  const [isClient, setIsClient] = useState(false);

  

  const getTotalPrice = useStore(cartStore, (state) => state.getTotalPrice);
  const getTotalItems = useStore(cartStore, (state) => state.getTotalItems);
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const [formData, setFormData] = useState<MatterFormData>(
    MatterCart1Store.getState().formData
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof MatterFormData, string>>
  >({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync store values with local form data initially or when store changes
  useEffect(() => {
    if (isClient) {
      const savedData = MatterCart1Store.getState().formData;
      setFormData((prev) => ({
        ...prev,
        ...savedData,
        province: storeProvince || savedData.province || prev.province,
        municipality:
          storeMunicipality || savedData.municipality || prev.municipality,
      }));
    }
  }, [isClient, storeProvince, storeMunicipality]);

  // Función para manejar cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "lastName") {
      // No trim() here to allow spaces while typing
      const names = value.split(/\s+/);
      const lastName1 = names[0] || "";
      const lastName2 = names.slice(1).join(" ") || "";

      setFormData((prev) => ({
        ...prev,
        lastName1,
        lastName2,
      }));

      if (errors.lastName1) {
        setErrors((prev) => ({ ...prev, lastName1: undefined }));
      }
      if (errors.lastName2) {
        setErrors((prev) => ({ ...prev, lastName2: undefined }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error cuando se escribe
    const fieldName = name as keyof MatterFormData;
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };

  // Función para manejar cambios en el teléfono
  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }));
    // Limpiar error del teléfono cuando se escribe
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar que el carrito contenga productos
    if (totalItems === 0) {
      return;
    }

    // Validar con Zod
    const result = cart1Schema.safeParse(formData);

    if (!result.success) {
      // Mostrar errores
      const fieldErrors: Partial<Record<keyof MatterFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof MatterFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Guardar datos del formulario en el store
    MatterCart1Store.getState().setFormData(formData);

    console.log(formData);

    // Si la validación es exitosa, navegar a cart2
    router.push("/cart2");
  };

  return (
    <div className="max-h-full   bg-white font-sans text-[#022954]">
      {/* Importe Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold uppercase tracking-wide mb-4 border-b pb-2 border-gray-200">
          Importe
        </h2>
        <div className="flex justify-between text-xl items-center text-gray-500">
          <span>Subtotal</span>
          <span>$ {isClient ? totalPrice.toFixed(2) : "0.00"} USD</span>
        </div>
      </div>

      {/* Personal Info Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#022954] mb-6">{fullName}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-md ">
          <div>
            <label className="ml-2 font-medium text-gray-600">Nombre</label>
            <InputField
              type="text"
              placeholder="Nombre"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label className="ml-2 font-medium text-gray-600">Apellidos</label>
            <InputField
              type="text"
              placeholder="Apellidos"
              name="lastName"
              value={`${formData.lastName1} ${formData.lastName2}`.trimStart()}
              onChange={handleInputChange}
            />
            {errors.lastName1 && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {errors.lastName1}
              </p>
            )}
            {!errors.lastName1 && errors.lastName2 && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {errors.lastName2}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="ml-2 font-medium text-gray-600">Teléfono</label>
            <div className="relative">
              {/* Teléfono con bandera */}
              <PhoneInput
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="Teléfono"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 ml-2">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="ml-2 font-medium text-gray-600">
              Carnet de Identidad
            </label>
            <InputField
              type="text"
              placeholder="Carnet de Identidad"
              name="identityCard"
              value={formData.identityCard}
              onChange={handleInputChange}
            />
            {errors.identityCard && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {errors.identityCard}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-md">
          <div>
            <label className="ml-2 font-medium text-gray-600">Provincia</label>
            <InputField
              type="text"
              name="province"
              value={storeProvince}
              readOnly
              placeholder="Provincia"
            />
            {errors.province && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {errors.province}
              </p>
            )}
          </div>

          <div>
            <label className="ml-2 font-medium text-gray-600">Municipio</label>
            <InputField
              type="text"
              name="municipality"
              value={storeMunicipality}
              readOnly
              placeholder="Municipio"
            />
            {errors.municipality && (
              <p className="text-red-500 text-xs mt-1 ml-2">
                {errors.municipality}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <div className="relative flex items-center ">
            <input
              type="checkbox"
              id="delivery"
              className="peer h-4 w-4 shrink-0 rounded-sm border border-gray-400 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#022954] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-[#022954] checked:border-[#022954] appearance-none"
              checked={formData.delivery}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setFormData((prev) => ({ ...prev, delivery: isChecked }));
                if (!isChecked && errors.address) {
                  setErrors((prev) => ({ ...prev, address: undefined }));
                }
              }}
            />
            <Check className="absolute h-3 w-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5" />
          </div>

          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="delivery"
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-500"
            >
              ¿Necesitas entrega a domicilio?
            </label>
          </div>
        </div>

        {formData.delivery && (
          <div>
            <div className="mt-6">
              <label className="ml-2 font-medium text-gray-600">
                Dirección
              </label>
              <InputField
                type="text"
                placeholder="Dirección"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {errors.address}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Order Summary Section */}
      <div className="mb-8">
        <h3 className=" font-bold uppercase tracking-wide mb-4 text-[#022954]">
          RESUMEN DEL PEDIDO
        </h3>
        <div className="bg-[#F5F7FA] rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 text-[#022954]">
            <span className="sm:text-xl">Subtotal</span>
            <span className="sm:text-xl">
              $ {isClient ? totalPrice.toFixed(2) : "0.00"} USD
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-[#E2E6EA]">
            <span className="font-bold text-[#022954] text-xl sm:text-2xl">
              Total a pagar
            </span>
            <span className="text-xl sm:text-3xl font-bold text-[#022954]">
              $ {isClient ? totalPrice.toFixed(2) : "0.00"}{" "}
              <span className="text-xl sm:text-3xl">USD</span>
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#022954] text-white py-4 px-20 text-base font-semibold rounded-xl hover:scale-103 transition cursor-pointer"
          >
            Confirmar Orden
          </button>
        </div>
      </form>
    </div>
  );
}
