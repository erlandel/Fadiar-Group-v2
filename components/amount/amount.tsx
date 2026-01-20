"use client";
import { Check, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
import { get_provinces_municipalitiesUrl } from "@/urlApi/urlApi";

interface MunicipalityData {
  id: number;
  municipio: string;
}

interface ProvinceData {
  id: number;
  provincia: string;
  code: string;
  municipios: MunicipalityData[];
}

export default function Amount() {
  const router = useRouter();
  const { auth } = useAuthStore();
  const {
    province: storeProvince,
    provinceId: storeProvinceId,
    municipality: storeMunicipality,
    municipalityId: storeMunicipalityId,
    setLocation,
  } = useProductsByLocationStore();

  const fullName = auth?.person
    ? `${auth.person.name} ${auth.person.lastname1} ${auth.person.lastname2}`
    : "";
  const [isClient, setIsClient] = useState(false);
  const [data, setData] = useState<ProvinceData[]>([]);
  const [openMunicipalities, setOpenMunicipalities] = useState(false);
  const municipalitiesRef = useRef<HTMLDivElement>(null);

  const items = useStore(cartStore, (state) => state.items);
  const rawCart = useStore(cartStore, (state) => (state as any).rawCart);

  const [formData, setFormData] = useState<MatterFormData>(defaultFormData);

  // Items del carrito (sin filtrar por domicilio)
  const filteredItems = items;

  const totalPrice = filteredItems.reduce((total, item) => {
    const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ""));
    return total + price * item.quantity;
  }, 0);

  const totalItems = filteredItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof MatterFormData, string>>
  >({});

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
          (d: any) => d.id_municipio === storeMunicipalityId
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
  }, []);

  useEffect(() => {
    const persistedFormData = MatterCart1Store.getState().formData;
    setFormData((prev) => ({
      ...prev,
      ...persistedFormData,
    }));
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch(`${get_provinces_municipalitiesUrl}`);
        const json = await res.json();
        if (Array.isArray(json)) {
          setData(json);
        } else {
          console.error("Provinces data is not an array:", json);
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching provinces:", err);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        municipalitiesRef.current &&
        !municipalitiesRef.current.contains(event.target as Node)
      ) {
        setOpenMunicipalities(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sync store values with local form data initially or when store changes
  useEffect(() => {
    if (isClient) {
      setFormData((prev) => ({
        ...prev,
        province: storeProvince || prev.province,
        municipality: storeMunicipality || prev.municipality,
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

    // Agrupar productos filtrados por tienda
    const storesMap = new Map<string | number, any>();
    
    filteredItems.forEach((item) => {
      if (!item.tiendaId) return;
      
      if (!storesMap.has(item.tiendaId)) {
        const tiendaInfo = rawCart?.find((t: any) => t.id === item.tiendaId);
        let storeDeliveryPrice = 0;
        
        if (formData.delivery && storeMunicipalityId && tiendaInfo) {
          const domicilio = tiendaInfo.domicilios?.find(
            (d: any) => d.id_municipio === storeMunicipalityId
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
          deliveryPrice: storeDeliveryPrice
        });
      }
      
      storesMap.get(item.tiendaId).products.push(item);
    });

    const selectedStores = Array.from(storesMap.values());

    // Guardar datos del formulario y tiendas en el store
    MatterCart1Store.getState().setFormData({
      ...formData,
      deliveryPrice: deliveryPrice,
      stores: selectedStores
    });

    // Si la validación es exitosa, navegar a cart2
    router.push("/cart2");
  };

  const currentProvinceData = Array.isArray(data)
    ? data.find((p) => p.provincia === storeProvince)
    : undefined;
  const municipalities = currentProvinceData
    ? currentProvinceData.municipios
    : [];

  const activeStoreIds = Array.from(
    new Set(items.map((item) => item.tiendaId).filter((id) => id != null))
  );

  const deliveryStores =
    Array.isArray(rawCart) && activeStoreIds.length > 0
      ? rawCart.filter(
          (tienda: any) =>
            activeStoreIds.includes(tienda.id) &&
            Array.isArray(tienda.domicilios) &&
            tienda.domicilios.length > 0
        )
      : [];

  const municipalitiesWithCommonDelivery =
    deliveryStores.length > 0
      ? municipalities.filter((mun) =>
          deliveryStores.every((tienda: any) =>
            tienda.domicilios.some((d: any) => d.id_municipio === mun.id)
          )
        )
      : municipalities;

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
        <h3 className="text-xl font-bold text-[#022954] mb-6">
          {isClient ? fullName : ""}
        </h3>
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

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6  text-md mt-6">
              <div>
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

              <div className="flex flex-col relative" ref={municipalitiesRef}>
                <label className="ml-2 font-medium text-gray-600">
                  Municipio
                </label>
                <div
                  tabIndex={0}
                  className="flex h-12 items-center justify-between rounded-2xl border border-gray-100 bg-[#F5F7FA] px-3 cursor-pointer focus-within:ring-2 focus-within:ring-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  onClick={() => {
                    if (storeProvince) {
                      setOpenMunicipalities(!openMunicipalities);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (storeProvince) {
                        setOpenMunicipalities(!openMunicipalities);
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
                          setFormData((prev) => ({
                            ...prev,
                            municipality: mun.municipio,
                          }));
                          MatterCart1Store.getState().updateFormData({
                            municipality: mun.municipio,
                          });
                          setLocation(
                            storeProvince,
                            storeProvinceId,
                            mun.municipio,
                            mun.id
                          );
                          setOpenMunicipalities(false);
                          if (errors.municipality) {
                            setErrors((prev) => ({
                              ...prev,
                              municipality: undefined,
                            }));
                          }
                        }}
                      >
                        {mun.municipio}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>


        <div className="mt-5">
            <label className="ml-2  font-medium text-gray-600">
              Nota
            </label>
          <textarea
            placeholder="Escribe aquí información adicional relevante (horarios de disponibilidad del domicilio, teléfonos secundarios, observaciones, etc.)."
            rows={5}
            name="note"
            // value={formData.note}
            onChange={handleInputChange}
            className="w-full  rounded-2xl px-4 py-3 bg-[#F5F7FA] text-gray-700 placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="flex items-start space-x-2 mt-6">
          <div className="relative flex items-center ">
            <input
              type="checkbox"
              id="delivery"
              className="peer h-4 w-4 shrink-0 rounded-sm border border-gray-400 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#022954] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-[#022954] checked:border-[#022954] appearance-none"
              checked={formData.delivery}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setFormData((prev) => ({ ...prev, delivery: isChecked }));
                MatterCart1Store.getState().updateFormData({
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
              <span className="text-accent text-xs ml-1"> 
                (Solo se mostrarán los municipios en los que todas las tiendas tengan domicilio en común.)
              </span>
            </label>
          </div>
        </div>

        {isClient && formData.delivery && (
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
         

          {isClient && formData.delivery && (
            <div>
               <div className="flex justify-between items-center p-4 text-[#022954]">
            <span className="sm:text-xl">Subtotal</span>
            <span className="sm:text-xl">
              $ {isClient ? totalPrice.toFixed(2) : "0.00"} USD
            </span>
          </div>

            <div className="flex justify-between items-center p-4 text-[#022954]">
              <span className="sm:text-xl">Domicilio</span>
              <span className="sm:text-xl">
                $ {isClient ? deliveryPrice.toFixed(2) : "0.00"} USD
              </span>
            </div>
            </div>
          )}
          <div className="flex justify-between items-center p-4 bg-[#E2E6EA]">
            <span className="font-bold text-[#022954] text-xl sm:text-2xl">
              Total a pagar
            </span>
            <span className="text-xl sm:text-3xl font-bold text-[#022954]">
              $ {isClient ? (totalPrice + deliveryPrice).toFixed(2) : "0.00"}{" "}
              <span className="text-xl sm:text-3xl">USD</span>
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#022954] text-white py-4 px-20 text-base font-semibold rounded-xl hover:bg-[#034078] hover:shadow-lg  hover:scale-103 transition cursor-pointer"
          >
            Confirmar Orden
          </button>
        </div>
      </form>
    </div>
  );
}
