"use client";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { server_url } from "@/lib/apiClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import ShoppingCartIcon from "../icons";

interface CardProps {
  category?: string;
  title: string;
  brand: string;
  warranty?: string;
  price: string;
  image: string;
  position?: "horizontal" | "vertical";
  maxWidthVertical?: string;
  actionIcon?: "cart" | "delete" | "none";
  quantityProducts?: number;
  temporal_price?: string;
  productId?: string | number;
  currency?: {
    currency: string;
  };
}

export default function Card({
  category,
  title,
  brand,
  warranty,
  price,
  image,
  position = "horizontal",
  maxWidthVertical = "480px",
  actionIcon = "cart",
  quantityProducts,
  temporal_price,
  productId,
  currency,
}: CardProps) {
  const router = useRouter();
  const addOrUpdateItem = useCartStore((state) => state.addOrUpdateItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const isCartAction = actionIcon === "cart";
  const isDeleteAction = actionIcon === "delete";
  const hasExternalQuantity =
    !isCartAction && quantityProducts && quantityProducts > 0;

  const [quantity, setQuantity] = useState(Math.max(1, quantityProducts ?? 1));

  useEffect(() => {
    if (quantityProducts && quantityProducts > 0) {
      setQuantity(quantityProducts);
    }
  }, [quantityProducts]);

  const handleCardClick = () => {
    if (productId) {
      router.push(`/products/id?id=${productId}`);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const adjustQuantity = (delta: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    
    if (!productId && productId !== 0) {
      console.warn("Product without ID cannot be added to cart");
      return;
    }

    const itemToAdd = {
      productId: productId,
      title,
      brand,
      category,
      warranty,
      price,
      temporal_price,
      image,
      quantity,
    };
    
    addOrUpdateItem(itemToAdd);

  
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!productId && productId !== 0) {
      console.warn("Product without ID cannot be removed");
      return;
    }

    removeItem(productId);
    console.log(`Removed ${title} from cart`);
  };

  const warrantyNumber = +(warranty ?? "0");

  return (
    <>
      {position === "vertical" ? (
        <div
          onClick={productId ? handleCardClick : undefined}
          className={`bg-white max-w-[184px] md:max-w-[250px] p-2 md:p-3 border border-gray-300 rounded-2xl shadow-sm h-[460px] flex flex-col justify-between ${
            productId ? "cursor-pointer hover:shadow-md transition-shadow" : ""
          }`}
        >
          {/* Imagen */}
          <div
            className="w-full h-4/12 overflow-hidden rounded-2xl shrink-0"
            style={{ minHeight: "190px" }}
          >
            <Image
              className="w-full h-full object-contain"
              alt={title}
              width={500}
              height={500}
              src={`${server_url}/${image}`}
            />
          </div>

          {/* Info del producto */}
          <div className="flex flex-col h-2/12">
            <p className="text-[#777777] text-sm mb-2">{category}</p>

            <div className="mb-4">
              <h3 className="text-[#022954] font-semibold text-lg line-clamp-1">
                {title}
              </h3>
              <p className="text-[#022954] text-md">{brand}</p>
            </div>
          </div>

          {/* Precio y acciones */}
          <div className="flex flex-col h-3/12 justify-end">
            {warrantyNumber > 0 ? (
              <p className="text-[#D69F04] text-sm font-medium mb-3">
                Garantía de {warrantyNumber / 30} meses
              </p>
            ) : (
              <p className="h-6 text-sm font-medium mb-3"></p>
            )}

            {temporal_price !== null && temporal_price !== undefined ? (
              <div className="flex flex-row items-center justify-between gap-2">
                <p className="flex items-baseline text-[#022954] font-bold text-2xl whitespace-nowrap">
                  ${temporal_price}
                  <span className="ml-1 text-[#022954] font-normal text-base">
                    USD
                  </span>
                </p>
                <p className="text-[#777777] text-md line-through whitespace-nowrap">
                  ${price} USD
                </p>
              </div>
            ) : (
              <p className="text-[#022954] font-bold text-2xl">
                ${price}{" "}
                <span className="text-[#022954] font-normal text-base">
                  {currency?.currency ?? "USD"}
                </span>
              </p>
            )}

            <div
              className="mt-auto flex flex-wrap items-center justify-between xl:gap-3 pt-2 font-bold"
              onClick={handleButtonClick}
            >
              {isCartAction ? (
                <>
                  <div className="flex items-center rounded-xl border border-gray-200 bg-white cursor-default ">
                    <button
                      className="px-2 py-1.5 2xl:px-3 2xl:py-2  text-accent hover:bg-gray-50 transition-colors"
                      onClick={adjustQuantity(-1)}
                      aria-label="Restar"
                    >
                      −
                    </button>
                    <span className="xl:px-2 2xl:px-4 py-1 border-x border-gray-300 min-w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      className="py-1.5 px-2 xl:py-1.5 2xl:px-3 2xl:py-2  text-accent hover:bg-gray-50 transition-colors"
                      aria-label="Sumar"
                      onClick={adjustQuantity(1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="rounded-xl  border border-primary hover:bg-primary hover:text-white transition-colors py-1.5  px-2.5 xl:py-2 xl:px-4 2xl:py-2.5 2xl:px-5"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                  </button>
                </>
              ) : isDeleteAction ? (
                <>
                  <p className="text-[#777777] text-sm">
                    Cantidad: {quantityProducts ?? quantity}
                  </p>
                  <button
                    className="p-2.5 px-4.5 md:px-7 border border-red-500 rounded-2xl hover:bg-red-50 transition-colors"
                    onClick={handleRemoveFromCart}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </>
              ) : hasExternalQuantity ? (
                <p className="text-[#777777] text-sm">
                  Cantidad: {quantityProducts}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={productId ? handleCardClick : undefined}
          className={`bg-white p-2 sm:p-4 border border-gray-300 rounded-2xl shadow-sm h-full flex flex-row gap-3 lg:gap-8 ${
            productId ? "cursor-pointer hover:shadow-md transition-shadow" : ""
          }`}
        >
          <div className="w-1/3 sm:w-48 overflow-hidden rounded-2xl">
            <Image
              className="w-full h-full object-contain"
              alt={title}
              width={500}
              height={500}
              src={`${server_url}/${image}`}
            />
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <p className="text-[#777777] text-sm mb-2">{category}</p>

            <div className="mb-3">
              <h3 className="text-primary font-bold text-md sm:text-lg line-clamp-2">
                {title}
              </h3>
              <p className="text-primary text-sm sm:text-md">{brand}</p>
            </div>

            {warrantyNumber > 0 ? (
              <p className="text-[#D69F04] text-sm font-medium mb-3">
                Garantía de {warrantyNumber / 30} meses
              </p>
            ) : (
              <p className="h-6 text-sm font-medium mb-3"></p>
            )}

            {temporal_price !== null && temporal_price !== undefined ? (
              <div className="flex flex-row items-center justify-between gap-2">
                <p className="flex items-baseline text-[#022954] font-bold text-2xl whitespace-nowrap">
                  ${temporal_price}
                  <span className="ml-1 text-[#022954] font-normal text-base">
                    USD
                  </span>
                </p>
                <p className="text-[#777777] text-md line-through whitespace-nowrap">
                  ${price} USD
                </p>
              </div>
            ) : (
              <p className="text-[#022954] font-bold text-2xl">
                ${price}{" "}
                <span className="text-[#022954] font-normal text-base">
                  {currency?.currency ?? "USD"}
                </span>
              </p>
            )}

            <div
              className="mt-auto flex items-center justify-between xl:gap-3 pt-2 font-bold"
              onClick={handleButtonClick}
            >
              {isCartAction ? (
                <>
                  <div className="flex items-center rounded-xl border border-gray-200 bg-white cursor-default ">
                    <button
                      className="px-2 py-1.5 2xl:px-3 2xl:py-2  text-accent hover:bg-gray-50 transition-colors"
                      onClick={adjustQuantity(-1)}
                      aria-label="Restar"
                    >
                      −
                    </button>
                    <span className="xl:px-2 2xl:px-4 py-1 border-x border-gray-300 min-w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      className="py-1.5 px-2 xl:py-1.5 2xl:px-3 2xl:py-2  text-accent hover:bg-gray-50 transition-colors"
                      aria-label="Sumar"
                      onClick={adjustQuantity(1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="rounded-xl  border border-primary hover:bg-primary hover:text-white transition-colors py-1.5  px-2 xl:py-2 xl:px-4 2xl:py-2.5 2xl:px-5"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                  </button>
                </>
              ) : isDeleteAction ? (
                <>
                  <p className="text-[#777777] text-sm">
                    Cantidad: {quantityProducts ?? quantity}
                  </p>
                  <button
                    className="p-2.5 px-4.5 md:px-7 border border-red-500 rounded-2xl hover:bg-red-50 transition-colors"
                    onClick={handleRemoveFromCart}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </>
              ) : hasExternalQuantity ? (
                <p className="text-[#777777] text-sm">
                  Cantidad: {quantityProducts}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
