"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IcSharpSearch } from "@/icons/icons";

import { getCountryListMap } from "country-flags-dial-code";
import countries from "i18n-iso-countries";
import es from "i18n-iso-countries/langs/es.json";

countries.registerLocale(es);

interface Country {
  name: string;
  code: string;
  flag: string;
  phoneCode: string;
}

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  defaultCountry?: { name: string; code: string; phoneCode: string };
}

export default function PhoneInput({
  value = "+53 ",
  onChange,
  placeholder = "Teléfono",
  defaultCountry = { name: "Cuba", code: "CU", phoneCode: "+53" },
}: PhoneInputProps) {
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputPhoneValue, setInputPhoneValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ===== CARGA DE PAÍSES (LOCAL, ESTABLE) ===== */
  useEffect(() => {
    const map = getCountryListMap();

    const mapped: Country[] = Object.values(map)
      .map((c: any) => {
        const nameEs =
          countries.getName(c.code, "es") ?? c.country;

        return {
          name: nameEs,
          code: c.code,
          phoneCode: c.dialCode,
          flag: `data:image/svg+xml;utf8,${encodeURIComponent(c.flag)}`,
        };
      })
      .filter((c) => c.phoneCode); // evita países sin código telefónico

    setCountriesList(mapped);
    setFilteredCountries(mapped);

    // Sincronizar el país seleccionado inicial con la lista completa para tener la bandera
    const initial = mapped.find((c) => c.code === selectedCountry.code);
    if (initial) setSelectedCountry(initial);
  }, []);

  /* ===== FILTRO ===== */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCountries(countriesList);
    } else {
      const normalizedQuery = searchQuery
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      setFilteredCountries(
        countriesList.filter((c) => {
          const normalizedName = c.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          return normalizedName.includes(normalizedQuery);
        })
      );
    }
  }, [searchQuery, countriesList]);

  /* ===== CLICK FUERA ===== */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  /* ===== SYNC PROPS ===== */
  useEffect(() => {
    if (!value) return;

    const parts = value.split(" ");
    const dialCode = parts[0];
    const phoneNum = parts.slice(1).join(" ");

    setInputPhoneValue(phoneNum);

    if (countriesList.length === 0) return;
    if (selectedCountry.phoneCode === dialCode) return;

    let country: Country | undefined;

    if (dialCode === "+1") {
      country =
        countriesList.find((c) => c.code === "US") ??
        countriesList.find((c) => c.phoneCode === dialCode);
    } else {
      country = countriesList.find((c) => c.phoneCode === dialCode);
    }

    if (country) setSelectedCountry(country);
  }, [value, countriesList, selectedCountry.phoneCode]);

  /* ===== HANDLERS ===== */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputPhoneValue(newVal);
    onChange?.(`${selectedCountry.phoneCode} ${newVal}`);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery("");
    onChange?.(`${country.phoneCode} ${inputPhoneValue}`);
  };

  /* ===== RENDER ===== */
  return (
    <div ref={dropdownRef} className="relative w-full">
      <div className="w-full flex items-center gap-2 rounded-2xl px-4 py-3 bg-[#F5F7FA] focus-within:ring-2 focus-within:ring-accent">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 hover:opacity-80"
        >
          <img
            src={(selectedCountry as Country).flag || `data:image/svg+xml;utf8,${encodeURIComponent(getCountryListMap()[selectedCountry.code]?.flag ?? "")}`}
            alt={selectedCountry.name}
            className="w-6 h-auto"
          />
          {isDropdownOpen ? (
            <ChevronUp className="h-4 w-4" strokeWidth={2} />
          ) : (
            <ChevronDown className="h-4 w-4"  strokeWidth={2}/>
          )}
        </button>

        <span className="text-gray-600 ">|</span>

        <input
          type="text"
          placeholder={placeholder}
          value={inputPhoneValue}
          onChange={handlePhoneChange}
          className="flex-1 bg-transparent outline-none"
        />
      </div>

      {isDropdownOpen && (
        <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto bg-white rounded-2xl shadow-lg border">
          <div className="sticky top-0 bg-white border-b p-3">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <IcSharpSearch className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar país..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountrySelect(country)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-left"
              >
                <img
                  src={country.flag}
                  alt={country.name}
                  className="w-6 h-auto"
                />
                <span>{country.name}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              No se encontraron países
            </div>
          )}
        </div>
      )}
    </div>
  );
}
