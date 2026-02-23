"use client";
import { Check, ChevronDown, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputField } from "../inputField/inputField";
import PhoneInput from "../phoneInput/phoneInput";
import { cart1Schema } from "../../validations/cart1Schema";
import { useStore } from "zustand";
import cartStore from "../../store/cartStore";
import MatterCart1Store, {
  FormData as MatterFormData,
  defaultFormData,
} from "@/store/matterCart1Store";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import useAuthStore from "@/store/authStore";
import useLocation from "@/hooks/locationRequests/useLocation";
import {  NotoV1Information } from "@/icons/icons";

export default function Amount() {
  const router = useRouter();
  const { auth } = useAuthStore();
  const {
    province: storeProvince,
    municipality: storeMunicipality,
    municipalityId: storeMunicipalityId,
  } = useProductsByLocationStore();
  const {
    municipalities: baseMunicipalities,
    handleMunicipalityChange,
    openMunicipalities,
    setOpenMunicipalities,
    municipalitiesRef,
  } = useLocation();

  const fullName = auth?.person
    ? `${auth.person.name} ${auth.person.lastname1} ${auth.person.lastname2}`
    : "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const items = useStore(cartStore, (state) => state.items);
  const rawCart = useStore(cartStore, (state) => (state as any).rawCart);

  const updateFormData = MatterCart1Store((state) => state.updateFormData);
  const storeFormData = MatterCart1Store((state) => state.formData);
  const formData = isClient ? storeFormData : defaultFormData;

  const [lastNameInput, setLastNameInput] = useState("");

  // Items del carrito (sin filtrar por domicilio)
  const filteredItems = items;

  const totalPrice = filteredItems.reduce((total, item) => {
    const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ""));
    return total + price * item.quantity;
  }, 0);

  const totalItems = filteredItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const currency = items.length > 0 ? items[0].currency?.currency : null;

  const [errors, setErrors] = useState<
    Partial<Record<keyof MatterFormData, string>>
  >({});

  const FIELD_ORDER: (keyof MatterFormData)[] = [
    "firstName",
    "lastName1",
    "lastName2",
    "province",
    "municipality",
    "phone",
    "address",
  ];

  const [deliveryPrice, setDeliveryPrice] = useState(0);

  useEffect(() => {
    if (
      formData.delivery &&
      storeMunicipalityId &&
      rawCart &&
      Array.isArray(rawCart)
    ) {
      let totalDelivery = 0;
      rawCart.forEach((tienda: any) => {
        const domicilio = tienda.domicilios?.find(
          (d: any) => d.id_municipio === storeMunicipalityId,
        );
        if (domicilio) {
          totalDelivery += Number(domicilio.price) || 0;
        }
      });
      setDeliveryPrice(totalDelivery);
    } else {
      setDeliveryPrice(0);
    }
  }, [formData.delivery, storeMunicipalityId, rawCart]);

  useEffect(() => {
    setIsClient(true);
    const persistedFormData = MatterCart1Store.getState().formData;
    const initialLastName = `${persistedFormData.lastName1 || ""} ${persistedFormData.lastName2 || ""}`.trim();
    setLastNameInput(initialLastName);
  }, []);

  // Sync store values with local form data initially or when store changes
  useEffect(() => {
    if (isClient) {
      if (
        (storeProvince && storeProvince !== formData.province) ||
        (storeMunicipality && storeMunicipality !== formData.municipality)
      ) {
        updateFormData({
          province: storeProvince || formData.province,
          municipality: storeMunicipality || formData.municipality,
        });
      }
    }
  }, [
    isClient,
    storeProvince,
    storeMunicipality,
    formData.province,
    formData.municipality,
    updateFormData,
  ]);

  // Función para manejar cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "lastName") {
      // Actualizar el estado local del input inmediatamente
      setLastNameInput(value);

      // Dividir el valor para obtener lastName1 y lastName2
      // Usamos regex para permitir múltiples espacios pero mantener la estructura
      const names = value.trim().split(/\s+/).filter(Boolean);
      const lastName1 = names[0] || "";
      const lastName2 = names.slice(1).join(" ") || "";

      updateFormData({
        lastName1,
        lastName2,
      });

      if (errors.lastName1) {
        setErrors((prev) => ({ ...prev, lastName1: undefined }));
      }
      if (errors.lastName2) {
        setErrors((prev) => ({ ...prev, lastName2: undefined }));
      }
      return;
    }

    updateFormData({ [name]: value });
    // Limpiar error cuando se escribe
    const fieldName = name as keyof MatterFormData;
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };

  // Función para manejar cambios en el teléfono
  const handlePhoneChange = (value: string) => {
    updateFormData({ phone: value });
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

      // Desplazarse al primer campo con error
      const firstErrorField = FIELD_ORDER.find((field) => fieldErrors[field]);
      if (firstErrorField) {
        // lastName1 y lastName2 comparten el mismo contenedor
        const elementId =
          firstErrorField === "lastName1" || firstErrorField === "lastName2"
            ? "field-lastName"
            : `field-${firstErrorField}`;

        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    // Agrupar productos filtrados por tienda
    const storesMap = new Map<string | number, any>();

    filteredItems.forEach((item) => {
      if (!item.tiendaId) return;

      if (!storesMap.has(item.tiendaId)) {
        const tiendaInfo = rawCart?.find((t: any) => t.id === item.tiendaId);
        let storeDeliveryPrice = 0;

        if (formData.delivery && storeMunicipalityId && tiendaInfo) {
          const domicilio = tiendaInfo.domicilios?.find(
            (d: any) => d.id_municipio === storeMunicipalityId,
          );
          if (domicilio) {
            storeDeliveryPrice = Number(domicilio.price) || 0;
          }
        }

        storesMap.set(item.tiendaId, {
          id: item.tiendaId,
          name: item.tiendaName || "Tienda Desconocida",
          direccion: item.tiendaDireccion || "",
          products: [],
          deliveryPrice: storeDeliveryPrice,
        });
      }

      storesMap.get(item.tiendaId).products.push(item);
    });

    const selectedStores = Array.from(storesMap.values());

    // Guardar datos del formulario y tiendas en el store
    MatterCart1Store.getState().setFormData({
      ...formData,
      deliveryPrice: deliveryPrice,
      stores: selectedStores,
    });

    // Si la validación es exitosa, navegar a cart2
    setIsSubmitting(true);
    router.push("/cart2");
  };

  const activeStoreIds = Array.from(
    new Set(items.map((item) => item.tiendaId).filter((id) => id != null)),
  );

  const deliveryStores =
    Array.isArray(rawCart) && activeStoreIds.length > 0
      ? rawCart.filter(
          (tienda: any) =>
            activeStoreIds.includes(tienda.id) &&
            Array.isArray(tienda.domicilios) &&
            tienda.domicilios.length > 0,
        )
      : [];

  const municipalitiesWithCommonDelivery =
    deliveryStores.length > 0
      ? baseMunicipalities.filter((mun) =>
          deliveryStores.every((tienda: any) =>
            tienda.domicilios.some((d: any) => d.id_municipio === mun.id),
          ),
        )
      : baseMunicipalities;

  // Auto-select common municipality if current is invalid or empty
  useEffect(() => {
    if (isClient && municipalitiesWithCommonDelivery.length > 0) {
      const isCurrentValid = municipalitiesWithCommonDelivery.some(
        (m) => m.municipio === storeMunicipality,
      );

      if (!storeMunicipality || !isCurrentValid) {
        const defaultMun = municipalitiesWithCommonDelivery[0];
        updateFormData({
          municipality: defaultMun.municipio,
        });
        handleMunicipalityChange(defaultMun);
      }
    }
  }, [
    isClient,
    municipalitiesWithCommonDelivery,
    storeMunicipality,
    handleMunicipalityChange,
  ]);

  return (
    <div className="w-full   bg-white font-sans text-[#022954]">
      {/* Importe Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold uppercase tracking-wide mb-4 border-b pb-2 border-gray-200">
          Importe
        </h2>
        {/* <div className="flex justify-between text-xl items-center text-gray-500">
          <span>Subtotal</span>
          <span>$ {isClient ? totalPrice.toFixed(2) : "0.00"} USD</span>
        </div> */}
      </div>

      {/* Personal Info Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#022954] ">
          Persona que recibe
        </h3>

        <div className="flex items-start space-x-2 mt-6">
          <div className="relative flex items-center ">
            <input
              type="checkbox"
              id="delivery"
              className="peer h-4 w-4 shrink-0 rounded-sm border border-gray-400 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#022954] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-[#022954] checked:border-[#022954] appearance-none"
              checked={formData.delivery}
              onChange={(e) => {
                const isChecked = e.target.checked;
                updateFormData({
                  delivery: isChecked,
                });
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

    
        {isClient && formData.delivery && (
          <div>
             <div className="w-full flex justify-center mt-3">
            <p className=" flex  sm:items-center text-accent text-md  ">
              <NotoV1Information className="h-4.5 w-4.5 mr-0.5 min-w-5 mt-1 sm:mt-0 " />
              Revise los municipios a los cuales se está haciendo domicilio.
            </p>
          </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6  text-md mt-3 ">
              <div id="field-firstName">
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

              <div id="field-lastName">
                <label className="ml-2 font-medium text-gray-600">
                  Apellidos
                </label>
                <InputField
                  type="text"
                  placeholder="Apellidos"
                  name="lastName"
                  value={lastNameInput}
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

              <div id="field-province">
                <label className="ml-2 font-medium text-gray-600">
                  Provincia
                </label>
                <InputField
                  type="text"
                  name="province"
                  value={isClient ? storeProvince : ""}
                  readOnly
                  placeholder="Provincia"
                />
                {errors.province && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.province}
                  </p>
                )}
              </div>

              <div className="flex flex-col relative" ref={municipalitiesRef} id="field-municipality">
                <label className="ml-2 font-medium text-gray-600">
                  Municipio
                </label>
                <div
                  tabIndex={0}
                  className="flex h-12 items-center justify-between rounded-2xl border border-gray-100 bg-[#F5F7FA] px-3 cursor-pointer focus-within:ring-2 focus-within:ring-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  onClick={() => {
                    if (storeProvince) {
                      setOpenMunicipalities((prev) => !prev);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (storeProvince) {
                        setOpenMunicipalities((prev) => !prev);
                      }
                    }
                  }}
                >
                  <span
                    className={
                      formData.municipality ? "text-gray-800" : "text-gray-500"
                    }
                  >
                    {formData.municipality || "Seleccione un municipio"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>

                {errors.municipality && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.municipality}
                  </p>
                )}

                {openMunicipalities && (
                  <ul className="absolute w-full mt-20 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-60 overflow-auto">
                    {municipalitiesWithCommonDelivery.map((mun) => (
                      <li
                        key={mun.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors text-gray-700"
                        onClick={() => {
                          handleMunicipalityChange(mun, (m) => {
                            const update = { municipality: m.municipio };
                            updateFormData(update);
                            setErrors((prev) => ({
                              ...prev,
                              municipality: undefined,
                            }));
                          });
                          setOpenMunicipalities(false);
                        }}
                      >
                        {mun.municipio}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2" id="field-phone">
                <label className="ml-2 font-medium text-gray-600">
                  Teléfono
                </label>
                <div className="relative">
                  {/* Teléfono con bandera */}
                  <PhoneInput
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="Teléfono"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 ml-2">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div id="field-address">
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


            <div className="mt-5">
              <label className="ml-2  font-medium text-gray-600">Nota</label>
              <textarea
                placeholder="Escribe aquí información adicional relevante (horarios de disponibilidad del domicilio, teléfonos secundarios, observaciones, etc.)."
                rows={5}
                name="note"
                // value={formData.note}
                onChange={handleInputChange}
                className="w-full  rounded-2xl px-4 py-3 bg-[#F5F7FA] text-gray-700 placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              />
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
          {isClient && formData.delivery && (
            <div>
              <div className="flex justify-between items-center p-4 text-[#022954]">
                <span className="sm:text-xl">Subtotal</span>
                <span className="sm:text-xl">
                  $ {isClient ? totalPrice.toFixed(2) : "0.00"} {currency ?? "USD"}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 text-[#022954]">
                <span className="sm:text-xl">Domicilio</span>
                <span className="sm:text-xl">
                  $ {isClient ? deliveryPrice.toFixed(2) : "0.00"} {currency ?? "USD"}
                </span>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center p-4 bg-[#E2E6EA]">
            <span className="font-bold text-[#022954] text-xl sm:text-2xl">
              Total a pagar
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#022954]">
              $ {isClient ? (totalPrice + deliveryPrice).toFixed(2) : "0.00"}{" "}
              <span className="text-xl sm:text-2xl">{currency ?? "USD"}</span>
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#022954] text-white h-14 w-72 text-base font-semibold rounded-xl hover:bg-[#034078] hover:shadow-lg hover:scale-103 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader className="h-5 w-5 animate-spin" strokeWidth={3} />
                Confirmando...
              </span>
            ) : (
              "Confirmar Orden"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
