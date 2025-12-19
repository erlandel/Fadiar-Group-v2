import Image from "next/image";
import "@fontsource/just-me-again-down-here";
import Countdown from "@/component/countdown/countdown";

export default function SectionPromoHome2() {
  return (
    <>
      <div className="bg-primary w-full h-[475px] md:h-[330px] relative   ">

        <div className="mx-4 md:mx-10 pt-10 sm:pt-0  md:h-full font-bold text-[36px]  w-150 flex flex-col  md:justify-center items-start md:text-4xl  2xl:text-5xl ">
          <span 
          data-animate="animate__lightSpeedInLeft"
          className="text-[#D69F04] animate-on-scroll">
            Próximamente
            <h3 className="text-white ">en nuestra Tienda</h3>
          </span>

          <div className="mt-4">
            <Countdown targetDate="2025-12-31T23:59:59" />
          </div>
        </div>

        <div>
          <img
            src="/images/Rectangle.png"
            alt="Background"
            className="absolute bottom-0 md:left-70 2xl:left-80 "
          />

          <img
            src="/images/Vector15.png"
            alt="Background"
            className="absolute bottom-0 ml-12 md:ml-120 2xl:ml-135"
          />

          <img           
            src="/images/Vector16.png"
            alt="Background"
            className="absolute bottom-0 left-4 md:left-95 2xl:left-110  w-330"
          />

          <img
           data-animate="animate__fadeInRight"
            src="/images/motorbike.svg"
            alt="Background"
            className="absolute right-2 left-1 sm:left-auto w-90 bottom-[-10]  md:bottom-[-30]  lg:right-5 2xl:right-30 md:w-100 lg:w-160  xl:w-187  animate-on-scroll [animation-delay:1.3s]"
          />
        </div>
      </div>
    </>
  );
}
