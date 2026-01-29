"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import useLocation from "@/hooks/location/useLocation";
import { Loading } from "../loading/loading";

const ModalProductsByLocation = () => {
  const { setIsOpen } = useProductsByLocationStore();
  const {
    data,
    loading,
    selectedProvince,
    selectedMunicipality,
    selectedMunicipalityId,
    municipalities,
    handleProvinceChange,
    handleMunicipalityChange,
    openProvinces,
    setOpenProvinces,
    openMunicipalities,
    setOpenMunicipalities,
    provincesRef,
    municipalitiesRef,
  } = useLocation();
  const [validationError, setValidationError] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleAccept = () => {
    setSubmitAttempted(true);
    if (
      !selectedProvince ||
      !selectedMunicipality ||
      selectedMunicipalityId === null
    ) {
      setValidationError(true);
      return;
    }
    setValidationError(false);
    setIsOpen(false);

    console.log("Ubicación guardada:", {
      provincia: selectedProvince,
      municipio: selectedMunicipality,
      municipioId: selectedMunicipalityId,
    });
  };

  return (
    <div className="bg-white sm:w-150 py-6 rounded-lg shadow-xl ">
      <h2 className="text-lg font-semibold mb-3 px-6">
        Lugar de entrega o recogida
      </h2>

      <div className="bg-gray-200 w-full h-px mb-4"></div>

      <p className="mb-4 text-gray-700 px-6">
        Se mostrarán los productos según la ubicación seleccionada
      </p>

      {loading ? (
        <div className="w-full flex justify-center items-center my-2">
          <div>
            <Loading />
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 mb-4 px-6">
          {/* Provincia */}
     

          <div className="flex flex-col relative" ref={provincesRef}>
            <label className="mb-1 text-sm font-medium">Provincia</label>
            <div
              tabIndex={0}
              className="flex h-12 items-center justify-between rounded-xl border border-gray-100 bg-[#F5F7FA] px-3 cursor-pointer focus-within:ring-2 focus-within:ring-accent focus:outline-none focus:ring-2 focus:ring-accent"
              onClick={() => setOpenProvinces((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenProvinces((prev) => !prev);
                }
              }}
            >
              <span
                className={selectedProvince ? "text-gray-800" : "text-gray-500"}
              >
                {selectedProvince || "Seleccione una provincia"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>

            {validationError && !selectedProvince && (
              <span className="text-red-500 text-sm mt-1 ml-2">
                Este campo es requerido
              </span>
            )}

            {openProvinces && (
              <ul className="absolute w-full mt-20 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-60 overflow-auto">
                {data.map((prov) => (
                  <li
                    key={prov.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors text-gray-700"
                    onClick={() => {
                      handleProvinceChange(prov, () => {
                        setOpenProvinces(false);
                        setValidationError(false);
                        setSubmitAttempted(false);
                      });
                    }}
                  >
                    {prov.provincia}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Municipio */}
          <div className="flex flex-col relative" ref={municipalitiesRef}>
            <label className="mb-1 text-sm font-medium">Municipio</label>
            <div
              tabIndex={0}
              className="flex h-12 items-center justify-between rounded-2xl border border-gray-100 bg-[#F5F7FA] px-3 cursor-pointer focus-within:ring-2 focus-within:ring-accent focus:outline-none focus:ring-2 focus:ring-accent"
              onClick={() => {
                if (selectedProvince) {
                  setOpenMunicipalities(!openMunicipalities);
                } else {
                  setValidationError(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (selectedProvince) {
                    setOpenMunicipalities(!openMunicipalities);
                  } else {
                    setValidationError(true);
                  }
                }
              }}
            >
              <span
                className={
                  selectedMunicipality ? "text-gray-800" : "text-gray-500"
                }
              >
                {selectedMunicipality || "Seleccione un municipio"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>

            {submitAttempted && !selectedMunicipality && (
              <span className="text-red-500 text-sm mt-1 ml-2">
                Este campo es requerido
              </span>
            )}

            {openMunicipalities && (
              <ul className="absolute w-full mt-20 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-60 overflow-auto">
                {municipalities.map((mun) => (
                  <li
                    key={mun.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors text-gray-700"
                    onClick={() => {
                      handleMunicipalityChange(mun, () => {
                        setOpenMunicipalities(false);
                        setValidationError(false);
                        setSubmitAttempted(false);
                      });
                    }}
                  >
                    {mun.municipio}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
        </div>
      )}
      <div className="bg-gray-200 w-full h-px mb-4 shadow-[0_-2px_3px_rgba(0,0,0,0.25)]"></div>

      <div className="flex justify-center sm:justify-end px-6">
        <button
          onClick={handleAccept}
          className="bg-accent text-black hover:bg-blue-900 hover:text-white hover:shadow-lg transition-all duration-300  px-6 py-2 rounded-full cursor-pointer"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default ModalProductsByLocation;
