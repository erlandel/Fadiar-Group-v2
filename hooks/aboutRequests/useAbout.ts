"use client";

import { useQuery } from "@tanstack/react-query";
import { statistics_about_usUrl } from "@/urlApi/urlApi";

export interface Statistic {
  name: string;
  text: string;
  value: number;
}

export const useAbout = () => {
  return useQuery<Statistic[]>({
    queryKey: ["statistics-about"],
    queryFn: async () => {
      const res = await fetch(statistics_about_usUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Error al obtener las estadísticas");
      }

      const data = await res.json();
      return Array.isArray(data.estadisticas) ? data.estadisticas : [];
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
