"use client";
import { useState } from "react";
import cartStore from "@/store/cartStore";
import useClockStore from "@/store/clockStore";
import { useDeleteFromCart } from "@/hooks/cartRequests/useDeleteFromCart";
import { useUpdateCart } from "@/hooks/cartRequests/useUpdateCart";
import { ShoppingCart, Trash2, AlarmClock, Timer } from "lucide-react";
import { server_url } from "@/urlApi/urlApi";
import LoadingDots from "../loadingDots/loadingDots";

interface CardCartProps {
  title: string;
  brand?: string;
  price: string;
  temporal_price?: string;
  image: string;
  actionIcon?: "cart" | "delete" | "none";
  quantityProducts?: number;
  currency?: {
    currency: string;
  };
  width?: string;
  padding?: string;
  bgColor?: string;
  hideQuantitySelector?: boolean;
  productId?: string;
  cartId?: number;
  tiendaId?: string;
  onDelete?: (productId: string) => void;
  expiryTimestamp?: number;
}

export default function CartCard({
  title,
  brand,
  price,
  temporal_price,
  image,
  actionIcon = "cart",
  quantityProducts,
  currency,
  width = "w-88",
  padding = "p-2",
  bgColor = "bg-white",
  hideQuantitySelector = false,
  productId,
  cartId,
  tiendaId,
  onDelete,
  expiryTimestamp,
}: CardCartProps) {
  const { getItemQuantity } = cartStore();
  const currentQuantity = productId ? getItemQuantity(productId) : 0;
  const currentTime = useClockStore((state) => state.currentTime);
  const { deleteFromCart, loading: deleting } = useDeleteFromCart();
  const { updateQuantity, loading: updating } = useUpdateCart();
  const [loadingType, setLoadingType] = useState<"increment" | "decrement" | null>(null);

  const formatCountdown = (expiry: number): string => {
    const remaining = Math.max(0, Math.floor((expiry - currentTime) / 1000));
    if (remaining === 0) return "Expirado";
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleDelete = async () => {
    if (!productId) return;

    if (cartId) {
      // Si tenemos cartId, usamos la lógica de backend
      await deleteFromCart(cartId.toString(), productId.toString());
    }
  };

  const handleUpdateQuantity = async (
    newQuantity: number,
    type: "increment" | "decrement",
  ) => {
    if (!cartId || newQuantity < 1) return;
    setLoadingType(type);
    try {
      await updateQuantity(cartId, newQuantity);
    } finally {
      setLoadingType(null);
    }
  };
  return (
    <>
      <div
        className={`${bgColor} ${width} ${padding} w-full border border-gray-300 rounded-2xl shadow-sm h-full flex flex-row `}
      >
        <div className="w-32 shrink-0 flex flex-col gap-1">
          <div className="w-32 h-[124px] overflow-hidden rounded-2xl">
            <img
              className="w-full h-full object-contain"
              src={`${server_url}/${image}`}
              alt={title}
            />
          </div>
          {expiryTimestamp && (
            <p className={`text-center md:text-lg font-semibold mt-1 ${
              Math.max(0, expiryTimestamp - currentTime) <= 60000
                ? "text-red-500 animate-[pulse_1s_ease-in-out_infinite]"
                : "text-primary"
            }`}>
              <span className="flex justify-center items-center gap-0.5">
                <Timer className="w-5 h-5" strokeWidth={2.5} />
                {formatCountdown(expiryTimestamp)}
              </span>
            </p>
          )}
        </div>

        <div className="flex-1 flex flex-col ml-4 min-w-0">
          <div className="mb-3">
            <h3 className="text-primary font-bold text-md sm:text-xl truncate">
              {title}
            </h3>
            <p className="text-primary text-md sm:text-xl">{brand}</p>
          </div>

         <p className="flex items-baseline xl:text-xl 2xl:text-2xl font-bold text-[#022954] mb-4">
            $
            {temporal_price && Number(temporal_price) !== 0
              ? temporal_price
              : price}{" "}
            <span className="ml-1 text-base font-normal text-[#022954]">
              {currency?.currency ?? "USD"}
            </span>
          </p>
          {/* quantityProducts */}
          <div className="mt-auto  flex items-center justify-between gap-2">
            {actionIcon === "none" ? (
              <p className="text-[#777777] text-md">
                Cantidad: {quantityProducts}
              </p>
            ) : (
              <div
                className={`relative flex items-center rounded-xl font-bold border transition-all duration-300 ${
                  actionIcon === "delete" ? "border-primary" : "border-gray"
                }`}
              >
                {updating && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/50 rounded-xl">
                    <div className=" sm:hidden">
                      <LoadingDots size="0.8rem" />
                    </div>
                    <div className="hidden sm:block">
                      <LoadingDots size="1.5rem" />
                    </div>
                  </div>
                )}
                <div
                  className={`flex items-center transition-opacity duration-300 ${updating ? "opacity-40" : "opacity-100"}`}
                >
                  <button
                    className="px-3 sm:px-4 py-2 text-accent disabled:cursor-not-allowed"
                    onClick={() =>
                      handleUpdateQuantity(currentQuantity - 1, "decrement")
                    }
                    disabled={updating}
                  >
                    −
                  </button>
                  <span className="px-4 my-1 border-x border-primary ">
                    {currentQuantity}
                  </span>
                  <button
                    className="px-3 sm:px-4 py-2 text-accent disabled:cursor-not-allowed"
                    onClick={() =>
                      handleUpdateQuantity(currentQuantity + 1, "increment")
                    }
                    disabled={updating}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div>
              {actionIcon === "delete" ? (
                deleting ? (
                  <Trash2
                    className="w-6 h-6 cursor-pointer text-red-500 transition-colors
                    animate__animated  animate__flash animate__infinite 
                    "
                  />
                ) : (
                  <Trash2
                    className="w-6 h-6 text-[#1E1E1E] cursor-pointer hover:text-red-500 transition-colors"
                    onClick={handleDelete}
                  />
                )
              ) : actionIcon === "cart" ? (
                <button className="p-2.5 px-8 border border-primary rounded-xl cursor-pointer">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
