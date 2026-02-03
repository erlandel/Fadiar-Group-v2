"use client";
import { useRouter } from "next/navigation";
import { CardProps } from "@/types/cardProps";
import { server_url } from "@/urlApi/urlApi";
import useLoadingStore from "@/store/loadingStore";

export default function CardProductPreSale({
  category,
  title,
  brand,
  warranty,
  price,
  image,
  temporal_price,
  productId,
  currency,
}: CardProps) {
  const router = useRouter();
  const startLoading = useLoadingStore((state) => state.startLoading);

  const handleCardClick = () => {
    if (productId) {
      startLoading();
      router.push(`/productID?id=${productId}&preSale=true`);
    }
  };

  const warrantyNumber = +(warranty ?? "0");

  return (
    <div
      onClick={productId ? handleCardClick : undefined}
      className={`bg-white h-100 w-full max-w-55 p-3 border border-gray-200 rounded-2xl shadow-sm flex flex-col justify-between gap-3 ${
        productId ? "cursor-pointer transition-shadow hover:shadow-md" : ""
      }`}
    >
      {/* Imagen */}
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-gray-50 shrink-0"
        style={{ height: "190px" }}
      >
         <div className="absolute top-2 -right-11  z-10 bg-accent text-white text-[10px] font-bold w-32 py-1 rotate-45 shadow-md text-center">
          Pronto
        </div>
        <img
          className="h-full w-full object-contain"
          alt={title}
          width={500}
          height={500}
          src={`${server_url}/${image}`}
        />
      </div>

      {/* Info del producto */}
      <div className="flex flex-col gap-2 shrink-0">
        <div>
          <p className="text-sm text-[#777777] line-clamp-1">{category}</p>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-[#022954] truncate">
            {title}
          </h3>
          <p className="text-md text-[#022954] line-clamp-1">{brand}</p>
        </div>
      </div>

      {/* Precio y acciones */}
      <div className="flex flex-1 flex-col justify-end gap-3 min-h-0">
        {warrantyNumber > 0 ? (
          <p className="text-sm font-medium text-[#D69F04]">
            Garantía de {warrantyNumber / 30} meses
          </p>
        ) : (
          <span className="h-6" />
        )}

        {temporal_price !== null && temporal_price !== undefined ? (
          <div className="flex flex-wrap items-baseline justify-between xl:gap-x-1 xl:gap-y-1 2xl:gap-x-3 2xl:gap-y-1">
            <p className="flex flex-wrap items-baseline xl:text-xl 2xl:text-2xl font-bold text-[#022954]">
              ${temporal_price}
              <span className="ml-1 text-base font-normal text-[#022954]">
                {currency?.currency }
              </span>
            </p>
            <p className="xl:text-md 2xl:text-lg text-[#777777] line-through">
              ${price} {currency?.currency }
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-baseline gap-2 text-[#022954]">
            <p className="xl:text-2xl 2xl:text-3xl font-bold">${price}</p>
            <span className="text-base font-normal">
              {currency?.currency}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
