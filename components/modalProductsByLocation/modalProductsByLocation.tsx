"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { server_url } from "@/lib/apiClient"; // importas tu server_url
import useProductsByLocationStore from "@/store/productsByLocationStore";

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

const ModalProductsByLocation = () => {
  const { province, municipality, municipalityId, setLocation, setIsOpen } = useProductsByLocationStore();
  const [data, setData] = useState<ProvinceData[]>([]);
  const [selectedProvince, setSelectedProvince] = useState(province || "");
  const [selectedMunicipality, setSelectedMunicipality] = useState(municipality || "");
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<number | null>(municipalityId || null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openProvinces, setOpenProvinces] = useState(false);
  const [openMunicipalities, setOpenMunicipalities] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const provincesRef = useRef<HTMLDivElement>(null);
  const municipalitiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedProvince(province || "");
    setSelectedMunicipality(municipality || "");
    setSelectedMunicipalityId(municipalityId || null);
  }, [province, municipality, municipalityId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        provincesRef.current &&
        !provincesRef.current.contains(event.target as Node)
      ) {
        setOpenProvinces(false);
      }
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

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch(`${server_url}/obtener-provincias-municipios`);
        const json = await res.json();
        console.log("res: ",json);
        setData(json); // json esperado: [{ provincia: 'La Habana', municipios: [...] }, ...]
      } catch (err) {
        console.error("Error fetching provinces:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const handleAccept = () => {
    setSubmitAttempted(true);
    if (!selectedProvince || !selectedMunicipality || selectedMunicipalityId === null) {
      setError(true);
      return;
    }
    setError(false);
    
    // Guardar en el store
    setLocation(selectedProvince, selectedMunicipality, selectedMunicipalityId);
    setIsOpen(false);
    
    console.log("Provincia:", selectedProvince);
    console.log("Municipio:", selectedMunicipality);
    console.log("Municipio ID:", selectedMunicipalityId);
  };

  const municipalities = data.find((p) => p.provincia === selectedProvince)?.municipios || [];

  return (
    <div className="bg-white sm:w-150 py-6 rounded-lg shadow-xl ">
      <h2 className="text-lg font-semibold mb-3 px-6">Lugar de entrega o recogida</h2>

      <div className="bg-gray-200 w-full h-px mb-4"></div>

      <p className="mb-4 text-gray-700 px-6 sm:tex">
        Se mostrarán los productos según la ubicación seleccionada
      </p>

      {loading ? (
       <p className="px-6 mb-2 loading-dots text-lg "> Cargando</p>

      ) : (
        <div className="grid sm:grid-cols-2 gap-4 mb-4 px-6">
          {/* Provincia */}
          <div className="flex flex-col relative" ref={provincesRef}>
            <label className="mb-1 text-sm font-medium">Provincia</label>
            <div
              tabIndex={0}
              className="flex h-12 items-center justify-between rounded-xl border border-gray-100 bg-[#F5F7FA] px-3 cursor-pointer focus-within:ring-2 focus-within:ring-accent focus:outline-none focus:ring-2 focus:ring-accent"
              onClick={() => setOpenProvinces(!openProvinces)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpenProvinces(!openProvinces);
                }
              }}
            >
              <span
                className={
                  selectedProvince ? "text-gray-800" : "text-gray-500"
                }
              >
                {selectedProvince || "Seleccione una provincia"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>

            {error && !selectedProvince && (
              <span className="text-red-500 text-sm mt-1 ml-2">Este campo es requerido</span>
            )}

            {openProvinces && (
              <ul className="absolute w-full mt-20 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-60 overflow-auto">
                {data.map((prov) => (
                  <li
                    key={prov.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors text-gray-700"
                    onClick={() => {
                      setSelectedProvince(prov.provincia);
                      setSelectedMunicipality("");
                      setOpenProvinces(false);
                      setError(false);
                      setSubmitAttempted(false);
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
                  setError(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (selectedProvince) {
                    setOpenMunicipalities(!openMunicipalities);
                  } else {
                    setError(true);
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
              <span className="text-red-500 text-sm mt-1 ml-2">Este campo es requerido</span>
            )}

            {openMunicipalities && (
              <ul className="absolute w-full mt-20 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-60 overflow-auto">
                {municipalities.map((mun) => (
                  <li
                    key={mun.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors text-gray-700"
                    onClick={() => {
                      setSelectedMunicipality(mun.municipio);
                      setSelectedMunicipalityId(mun.id);
                      setOpenMunicipalities(false);
                      setError(false);
                      setSubmitAttempted(false);
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
