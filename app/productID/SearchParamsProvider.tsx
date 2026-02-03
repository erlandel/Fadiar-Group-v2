"use client";
import type React from "react";
import { useSearchParams } from "next/navigation";

interface SearchParamsProviderProps {
  children: (params: { id: string | null; isPreSale: boolean }) => React.ReactNode;
}

export function SearchParamsProvider({ children }: SearchParamsProviderProps) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const preSaleParam = searchParams.get("preSale");
  const isPreSale = preSaleParam === "true";

  return <>{children({ id, isPreSale })}</>;
}
