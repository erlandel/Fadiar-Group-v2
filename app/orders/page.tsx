"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import MobileOrdes from "@/components/mobileOrdes/mobileOrdes";
import OrdersTable from "@/components/ordersTable/ordersTable";
import { SectionMobile } from "@/sections/sectionMobile";
import { BannerMobilePay } from "@/components/banner/bannerMobilePay";
import { BestSelling } from "@/sections/sectionsProducts/bestSelling";
import { useGetOrders } from "@/hooks/orderRequests/useGetOrders";
import InformationMessage from "@/messages/informationMessage";
import MatterCart1Store from "@/store/matterCart1Store";

export default function Orders() {
  const { orders, hasMore, fetchOrders, updateOrderProducts, updateOrderNote } =
    useGetOrders();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const titleRef = useRef<HTMLDivElement | null>(null);
  const formData = MatterCart1Store((state) => state.formData);
  const updateFormData = MatterCart1Store((state) => state.updateFormData);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (formData.showDeliveryOverlay) {
      setShowOverlay(true);
      updateFormData({ showDeliveryOverlay: false });
    }
  }, [formData.showDeliveryOverlay, updateFormData]);

  const fetchOrdersMutation = useMutation({
    mutationFn: (params: {
      lastId: string | number;
      size: number;
      searchText: string;
    }) => fetchOrders(params.lastId, params.size, params.searchText),
  });

  useEffect(() => {
    fetchOrdersMutation.mutate({
      lastId: 0,
      size: (currentPage - 1) * itemsPerPage,
      searchText: "",
    });
  }, [currentPage]);

  useEffect(() => {
    if (
      !fetchOrdersMutation.isPending &&
      fetchOrdersMutation.isSuccess &&
      currentPage > 1
    ) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      if (orders.length <= startIndex) {
        setCurrentPage(1);
      }
    }
  }, [
    orders.length,
    currentPage,
    fetchOrdersMutation.isPending,
    fetchOrdersMutation.isSuccess,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: "auto", block: "start" });
    }
  };

  const firstOrderId =
    formData.orderId || (orders.length > 0 ? orders[0].id : "");

  const messageTitle = "¡Gracias por su compra!";
  const effectiveDelivery = formData.overlayDelivery ?? formData.delivery;
  const messageBodyLines = effectiveDelivery
    ? [
        "Su pedido ha sido confirmado exitosamente.",
        `Número pedido: #${firstOrderId}.`,
        "La entrega se realizará en un plazo de 24 a 48 horas.",
        "Nuestro equipo logístico se comunicará al número telefónico proporcionado para coordinar los detalles.",
        "Gracias por confiar en Grupo Fadiar.",
      ]
    : [
        "Su pedido ha sido confirmado exitosamente.",
        `Número pedido: #${firstOrderId}.`,
        "Puede recogerlo en nuestra sede en un plazo de 7 días hábiles.",
        "Deberá presentar su número de pedido al momento de la recogida.",
        "Si necesita más información, nuestro equipo estará disponible para asistirle.",
        "Gracias por confiar en Grupo Fadiar.",
      ];

  return (
    <>
      {showOverlay && (
        <div className="fixed inset-0 z-250 h-screen flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="max-w-300 w-full">
            <InformationMessage
              onClose={() => {
                setShowOverlay(false);
                updateFormData({ overlayDelivery: false, orderId: "" });
              }}
              title={messageTitle}
              bodyLines={messageBodyLines}
            />
          </div>
        </div>
      )}

      {/* <div className="mx-4 xl:px-40 mt-2">
        <InformationMessage />
      </div> */}

      <div className="mx-4 mt-10 md:mt-15 xl:px-20 2xl:px-40 ">
        <div className=" flex  justify-between items-center">
          <div
            ref={titleRef}
            className="  lg:ml-40 scroll-mt-35 xl:scroll-mt-25 "
          >
            <h2 className="text-3xl text-primary font-bold">Mis Pedidos</h2>
          </div>
        </div>

        <div className="xl:hidden">
          <MobileOrdes
            orders={orders}
            fetchOrdersMutation={fetchOrdersMutation}
            updateOrderProducts={updateOrderProducts}
            hasMore={hasMore}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        <div className="hidden xl:block">
          <OrdersTable
            orders={orders}
            fetchOrdersMutation={fetchOrdersMutation}
            updateOrderProducts={updateOrderProducts}
            updateOrderNote={updateOrderNote}
            hasMore={hasMore}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <div className="sm:py-20  mt-60 sm:mt-10">
        <SectionMobile />
      </div>

      <div className="sm:hidden mt-60">
        <BannerMobilePay />
      </div>

      <div className="xl:hidden">
        <BestSelling />
      </div>
    </>
  );
}
