import "@fontsource/just-me-again-down-here";
import Countdown from "@/components/countdown/countdown";

export default function BannerEngine() {
  return (
    <>
      <div className="grid h-[480px] sm:h-135 md:h-auto  items-center">

        <div className="bg-primary w-full h-[440px] sm:h-[480px]  md:h-[330px] relative row-start-1 col-start-1">
          <div>
            <img
              src="/images/Rectangle.webp"
              alt="Background"
              className="absolute bottom-0 right-0 w-full h-5 xl:h-12 xl:left-80 md:left-70 md:h-8  "
            />

            <img
              src="/images/Vector15.webp"
              alt="Background"
              className="absolute bottom-0 right-0 w-full left-15 h-8 sm:left-30 md:left-110 md:h-15  xl:h-20 xl:left-140  3xl:left-150 "
            />

            <img
              src="/images/Vector16.webp"
              alt="Background"
              className="absolute bottom-0 right-0 w-full left-5 h-12 sm:left-15 md:left-90 md:h-20  xl:h-28 xl:left-110 "
            />
          </div>
        </div>

        <div className="z-10 row-start-1 col-start-1 h-full flex flex-col gap-5 md:flex-row justify-end items-center md:justify-between md:items-center animate__animated animate__fadeIn animate__delay-1.5s">

          <div className="mx-4 md:mx-10 font-bold text-[36px]   md:text-4xl  2xl:text-5xl md:h-auto animate__animated animate__fadeIn animate__delay-2s">
            <span
              data-animate="animate__lightSpeedInLeft"
              className="text-[#D69F04] animate-on-scroll"
            >
              Próximamente
              <h3 className="text-white ">en nuestra Tienda</h3>
            </span>

            <div className="mt-4">
              <Countdown targetDate="2025-12-31T23:59:59" />
            </div>
          </div>

          <div className="md:self-end 2xl:w-5/9">
            <img
              data-animate="animate__fadeInRight"
              src="/images/productos.webp"
              alt="Background"
              className="w-auto h-50 sm:h-60 md:h-60 lg:h-auto xl:h-100  animate-on-scroll [animation-delay:1.3s]"
            />
          </div>

          
        </div>
        
      </div>
    </>
  );
}
