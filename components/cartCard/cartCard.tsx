"use client";
import { server_url } from "@/lib/apiClient";
import cartStore from "@/store/cartStore";
import { useDeleteFromCart } from "@/hooks/cartRequests/useDeleteFromCart";
import { useUpdateCart } from "@/hooks/cartRequests/useUpdateCart";
import { ShoppingCart, Trash2 } from "lucide-react";

interface CardCart4Props {
  title: string;
  brand?: string;
  price: string;
  image: string;
  actionIcon?: "cart" | "delete" | "none";
  quantityProducts?: number;
  width?: string;
  padding?: string;
  bgColor?: string;
  hideQuantitySelector?: boolean;
  productId?: number | string;
  cartId?: number;
  tiendaId?: number | string;
  onDelete?: (productId: number | string) => void;
}

export default function CartCard({
  title,
  brand,
  price,
  image,
  actionIcon = "cart",
  quantityProducts,
  width = "w-88",
  padding = "p-2",
  bgColor = "bg-white",
  hideQuantitySelector = false,
  productId,
  cartId,
  tiendaId,
  onDelete,
}: CardCart4Props) {
  const { getItemQuantity } = cartStore();
  const currentQuantity = productId ? getItemQuantity(productId) : 0;
  const { deleteFromCart, loading: deleting } = useDeleteFromCart();
  const { updateQuantity, loading: updating } = useUpdateCart();

  const handleDelete = async () => {
    if (!productId) return;
    
    if (cartId) {
      // Si tenemos cartId, usamos la lógica de backend
      await deleteFromCart(cartId, productId);
    } 
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!cartId || newQuantity < 1) return;
    await updateQuantity(cartId, newQuantity);
  };
  return (
    <>
      <div
        className={`${bgColor} ${width} ${padding} max-w-120 border border-gray-300 rounded-2xl shadow-sm h-full flex flex-row `}
      >
        <div className="w-32 h-[124px] overflow-hidden rounded-2xl">
          <img
            className="w-full h-full object-contain"
            src={`${server_url}/${image}`}
            alt={title}
          />
        </div>

        <div className="flex-1 flex flex-col ml-4">
          <div className="mb-3">
            <h3 className="text-primary font-bold  text-md sm:text-xl line-clamp-2">
              {title}
            </h3>
            <p className="text-primary text-md sm:text-xl">{brand}</p>
          </div>

          <p className="text-primary font-bold text-lg sm:text-2xl  mb-4">
            ${price}{" "}
            <span className="text-primary font-normal text-lg sm:text-2xl">
              USD
            </span>
          </p>
          {/* quantityProducts */}
          <div className="mt-auto  flex items-center justify-between gap-2">
            {actionIcon === "none" ? (
              <p className="text-[#777777] text-md">
                Cantidad: {quantityProducts}
              </p>
            ) : (
              <div className={`flex items-center  rounded-xl font-bold border ${
                  actionIcon === "delete" ? "border-primary" : "border-gray"
                } ${updating ? "opacity-50 pointer-events-none" : ""}`}
              >
                <button className="px-3 sm:px-4 py-2 text-accent " onClick={() => handleUpdateQuantity(currentQuantity - 1)}>
                  −
                </button>
                <span className="px-4 my-1 border-x border-primary ">
                  {currentQuantity}
                </span>
                <button className="px-3 sm:px-4 py-2 text-accent " onClick={() => handleUpdateQuantity(currentQuantity + 1)}>
                  +
                </button>
              </div>
            )}

            <div>
              {actionIcon === "delete" ? (
                <Trash2
                  className={`w-6 h-6 text-[#1E1E1E] cursor-pointer hover:text-red-500 transition-colors ${deleting ? "opacity-50" : ""}`}
                  onClick={handleDelete}
                />
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
