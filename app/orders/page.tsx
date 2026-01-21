"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import MobileOrdes from "@/components/mobileOrdes/mobileOrdes";
import OrdersTable from "@/components/ordersTable/ordersTable";
import { SectionAbout3 } from "@/section/aboutUS/sectionAbout3";
import { SectionAbout4 } from "@/section/aboutUS/sectionAbout4";
import { BestSelling } from "@/section/bestSelling/bestSelling";
import { useGetOrders } from "@/hooks/orderRequests/useGetOrders";

export default function Orders() {
  const { orders, hasMore, fetchOrders, updateOrderProducts } = useGetOrders();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const titleRef = useRef<HTMLDivElement | null>(null);

  const fetchOrdersMutation = useMutation({
    mutationFn: (params: {
      lastId: string | number;
      size: number;
      searchText: string;
    }) => fetchOrders(params.lastId, params.size, params.searchText),
    onSuccess: () => {
      if (titleRef.current) {
        titleRef.current.scrollIntoView({ behavior: "auto", block: "start" });
      }
    },
  });

  useEffect(() => {
    fetchOrdersMutation.mutate({
      lastId: 0,
      size: (currentPage - 1) * itemsPerPage,
      searchText: "",
    });
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: "auto", block: "start" });
    }
  };

  return (
    <>
      <div className="mx-4 xl:px-40 mt-10 md:mt-15">
        <div className=" flex  justify-between items-center">
          <div ref={titleRef} className="  lg:ml-40">
            <h2 className="text-3xl text-primary font-bold">Mis Pedidos</h2>
          </div>

          <div>
            {fetchOrdersMutation.isError && (
              <p className="text-red-500 text-sm font-medium mb-2 text-center">
                Error al cargar pedidos.
              </p>
            )}
          </div>
        </div>

        <div className="lg:hidden">
          <MobileOrdes
            orders={orders}
            fetchOrdersMutation={fetchOrdersMutation}
            updateOrderProducts={updateOrderProducts}
            hasMore={hasMore}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        <div className="hidden lg:block">
          <OrdersTable
            orders={orders}
            fetchOrdersMutation={fetchOrdersMutation}
            updateOrderProducts={updateOrderProducts}
            hasMore={hasMore}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <div className="sm:py-20  mt-60 sm:mt-10">
        <SectionAbout3 />
      </div>

      <div className="sm:hidden mt-60">
        <SectionAbout4 />
      </div>

      <div className="xl:hidden">
        <BestSelling />
      </div>
    </>
  );
}
