"use client";

import { useEffect, useState, useRef } from "react";
import useProductsByLocationStore from "@/store/productsByLocationStore";
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

const useLocation = () => {
  const {
    province,
    provinceId,
    municipality,
    municipalityId,
    setLocation,
  } = useProductsByLocationStore();

  const [data, setData] = useState<ProvinceData[]>([]);
  const [selectedProvince, setSelectedProvince] = useState(province || "");
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(
    provinceId || null,
  );
  const [selectedMunicipality, setSelectedMunicipality] = useState(
    municipality || "",
  );
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<
    number | null
  >(municipalityId || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openProvinces, setOpenProvinces] = useState(false);
  const [openMunicipalities, setOpenMunicipalities] = useState(false);

  const provincesRef = useRef<HTMLDivElement>(null);
  const municipalitiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (provincesRef.current && !provincesRef.current.contains(target)) {
        setOpenProvinces(false);
      }

      if (
        municipalitiesRef.current &&
        !municipalitiesRef.current.contains(target)
      ) {
        setOpenMunicipalities(false);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, []);

  useEffect(() => {
    setSelectedProvince(province || "");
    setSelectedProvinceId(provinceId || null);
    setSelectedMunicipality(municipality || "");
    setSelectedMunicipalityId(municipalityId || null);
  }, [province, provinceId, municipality, municipalityId]);

  useEffect(() => {
    let cancelled = false;

    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const res = await fetch(get_provinces_municipalitiesUrl);
        const json = await res.json();

        if (!cancelled && Array.isArray(json)) {
          setData(json);
          setError(null);
        } else if (!cancelled) {
          setData([]);
          setError("Error al cargar las provincias");
        }
      } catch {
        if (!cancelled) {
          setError("Error al cargar las provincias");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProvinces();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleProvinceChange = (
    prov: ProvinceData,
    onSelect?: (prov: ProvinceData) => void,
  ) => {
    setSelectedProvince(prov.provincia);
    setSelectedProvinceId(prov.id);
    setSelectedMunicipality("");
    setSelectedMunicipalityId(null);
    setLocation(prov.provincia, prov.id, "", null);
    if (onSelect) onSelect(prov);
  };

  const handleMunicipalityChange = (
    mun: MunicipalityData,
    onSelect?: (mun: MunicipalityData) => void,
  ) => {
    const finalProvince = selectedProvince;
    let finalProvinceId = selectedProvinceId;

    if (!finalProvinceId && finalProvince) {
      const found = data.find((p) => p.provincia === finalProvince);
      if (found) {
        finalProvinceId = found.id;
        setSelectedProvinceId(found.id);
      }
    }

    setSelectedMunicipality(mun.municipio);
    setSelectedMunicipalityId(mun.id);
    setLocation(finalProvince, finalProvinceId ?? null, mun.municipio, mun.id);
    if (onSelect) onSelect(mun);
  };

  const municipalities =
    data.find((p) => p.provincia === selectedProvince)?.municipios || [];

  return {
    data,
    loading,
    error,
    selectedProvince,
    selectedProvinceId,
    selectedMunicipality,
    selectedMunicipalityId,
    municipalities,
    handleProvinceChange,
    handleMunicipalityChange,
    setSelectedProvince,
    setSelectedProvinceId,
    setSelectedMunicipality,
    setSelectedMunicipalityId,
    openProvinces,
    setOpenProvinces,
    openMunicipalities,
    setOpenMunicipalities,
    provincesRef,
    municipalitiesRef,
  };
};

export default useLocation;

