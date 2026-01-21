
"use client";

import useLoadingStore from "@/store/loadingStore";

export default function ProductLoadingId() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-100  flex items-center justify-center bg-white/1 backdrop-blur-xs">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-accent rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}

