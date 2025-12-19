"use client";
import { useSearchParams } from "next/navigation";

interface SearchParamsProviderProps {
  children: (id: string | null) => React.ReactNode;
}

export function SearchParamsProvider({ children }: SearchParamsProviderProps) {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  return <>{children(id)}</>;
}
