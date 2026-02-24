"use client";

import ButtonPromoHome1 from "@/components/button/buttonPromoHome1";
import { ArrowRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import useLoadingStore from "@/store/loadingStore";
import useFilterStore from "@/store/filterStore";

export default function SectionMoreproducts() {
  const router = useRouter();
  const pathname = usePathname();
  const startLoading = useLoadingStore((state) => state.startLoading);
  const setSelectedCategories = useFilterStore(
    (state) => state.setSelectedCategories,
  );
  const setShouldScrollToProducts = useFilterStore(
    (state) => state.setShouldScrollToProducts,
  );

  const checkActive = (href: string) => {
    const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
    const normalizedHref = href.endsWith("/") ? href : `${href}/`;
    return normalizedPath === normalizedHref;
  };

  const handleNavigateWithCategory = (category: string) => {
    setSelectedCategories([category]);
    setShouldScrollToProducts(true);
    
    if (!checkActive("/products")) {
      startLoading();
      router.push("/products");
    }
  };
  return (
    <>
      <div className=" mx-4 xl:mx-10  2xl:mx-20  mt-20 xl:mt-30 text-start animate__animated  animate__lightSpeedInLeft">
        {/* <span className="text-[#022954] text-xl font-bold">
          Entra y consulta
        </span> */}
          <h3 className="text-primary text-2xl font-bold">
           Elige tu solución ideal !!!
          </h3>
      </div>

      <div className="flex  flex-col mx-4 mt-5 sm:mt-0 xl:flex-row justify-center items-center gap-5">
        <div
          id="card1"
          data-animate="animate__backInLeft"
          className=" flex justify-center items-center w-auto sm:w-140 2xl:w-160 xl:mt-7 xl:ml-20  overflow-hidden rounded-xl animate-on-scroll "
        >
          <div className="z-10 w-1/3  xl:mb-10">
            <div className="text-black  ">
              <h4 className="font-bold text-xl">Ventiladores</h4>
              <p className="text-xs w-42 sm:text-base sm:w-64 2xl:w-72">
                Lorem ipsum dolor sit amet consectetur adipiscing elit hendrerit
                scelerisque.
              </p>
              <div className="mt-5 w-30 sm:w-auto">
                <ButtonPromoHome1
                  name="Ver más"
                  color="#022954"
                  icon={<ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
                  onClick={() => handleNavigateWithCategory("ventiladores")}
                />
              </div>
            </div>
          </div>

          <div>
            <img
              src="/images/vent.webp"
              alt="vent"
              className=" object-cover "
            />
          </div>
        </div>

        <div
          id="card2"
          data-animate="animate__backInRight"
          className=" flex w-auto  sm:w-140 2xl:w-160  justify-center items-center   animate-on-scroll"
        >
          <div className="w-1/9   text-black z-10 xl:mb-5">
            <h4 className="font-bold text-xl w-50">Refrigeradores y Neveras</h4>
            <p className="text-xs sm:text-base w-40 sm:w-64 xl:w-72  ">
              Lorem ipsum dolor sit amet consectetur adipiscing elit hendrerit
              scelerisque, blandit duis sapien.
            </p>

            <div className="mt-1 md:mt-5 w-40">
              <ButtonPromoHome1
                name="Ver más"
                color="#022954"
                icon={<ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
                onClick={() =>
                  handleNavigateWithCategory("refrigeradores y neveras")
                }
              />
            </div>
          </div>

          <div className="mt-5">
            <img
              src="/images/Fridge.webp"
              alt="vent"
              className="object-cover  sm:mt-5  ml-4 xl:mt-0"
            />
          </div>
        </div>
      </div>
    </>
  );
}
