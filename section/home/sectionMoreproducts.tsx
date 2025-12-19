"use client";

import ButtonPromoHome1 from "@/component/button/buttonPromoHome1";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SectionMoreproducts() {
  const router = useRouter();
  return (
    <>
      <div className=" px-4 md:px-25 2xl:px-28 mt-10 2xl:mt-30 text-start animate__animated  animate__lightSpeedInLeft">
        <span className="text-[#022954] text-xl font-bold">
          Entra y consulta
          <h3 className="text-accent text-2xl font-bold">
            Categorias destacadas
          </h3>
        </span>
      </div>

      <div className="flex flex-col mx-3 xl:flex-row justify-center items-center  ">
        <div
          id="card1"
          data-animate="animate__backInLeft"
          className=" xl:w-6/12  sm:mx-15 xl:mx-0  relative overflow-hidden rounded-xl animate-on-scroll "
        >
          <div className="absolute inset-0 z-10 flex flex-col justify-center sm:p-2 xl:ml-32 w-55 sm:w-70 lg:w-80 xl:w-70  2xl:w-82">
            <div            
            className="text-black  ">
              <h4 className="font-bold text-xl">Ventilador</h4>
              <p className="text-xs w-42 sm:text-base sm:w-full">
                Lorem ipsum dolor sit amet consectetur adipiscing elit hendrerit
                scelerisque.
              </p>
              <div className="mt-5 ">
                <ButtonPromoHome1
                  name="Ver más"
                  color="#022954"
                  icon={<ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
                  onClick={() => router.push("/products")}
                />
              </div>
            </div>
          </div>
          <div>
            <img
              src="/images/vent.png"
              alt="vent"
              className="w-70 h-55 ml-25 mt-4 sm:w-90 sm:h-70 sm:ml-50  md:h-90 md:w-120   xl:ml-82 2xl:ml-90 xl:w-90  2xl:w-1/2 xl:h-1/2 object-cover "
            />
          </div>
        </div>

        <div
          id="card2"
          data-animate="animate__backInRight"
          className=" xl:w-6/12 flex sm:mx-15 xl:mx-0  justify-center items-center relative  animate-on-scroll"
        >
          <div className="absolute left-[-10]  xl:left-auto xl:mr-60 2xl:mr-60  z-50 w-50 sm:w-70 md:w-80 p-4 text-black">
            <h4 className="font-bold text-xl">Refrigeradores y Neveras</h4>
            <p className="text-xs sm:text-base ">
              Lorem ipsum dolor sit amet consectetur adipiscing elit hendrerit
              scelerisque, blandit duis sapien.
            </p>

            <div className="mt-1 md:mt-5">
              <ButtonPromoHome1
                name="Ver más"
                color="#022954"
                icon={<ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
                onClick={() => router.push("/products")}
              />
            </div>
          </div>

          <div className="mt-5">
            <img
              src="/images/Fridge.png"
              alt="vent"
              className="ml-8 sm:ml-10    xl:h-70   object-contain xl:ml-30"
            />
          </div>
        </div>
      </div>
    </>
  );
}
