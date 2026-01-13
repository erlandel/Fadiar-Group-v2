import "@fontsource/just-me-again-down-here";
import BottomShadow from "@/components/ui/bottomShadow";

export default function SectionPromoHome1() {
  return (
    <>
      <div className="grid h-[400px] sm:h-[360px] lg:h-[300px]  xl:h-[400px]  ">
        <div className="bg-primary w-full h-[380px] sm:h-[360px] md:h-[280px] lg:h-[300px] xl:h-[340px]  2xl:h-[410px] row-start-1 col-start-1"></div>

        <div className="z-10 mt-8 row-start-1 col-start-1 flex flex-col md:flex-row md:justify-around items-center xl:justify-center  mx-4 xl:ml-10 2xl:mx-20">
          <div
            id="lorem"
            className=" text-white md:mb-30 md:w-4/9  "
          >
            <h1 className="text-[28px]  lg:text-4xl xl:text-5xl font-bold  animate__animated  animate__lightSpeedInLeft">
              <samp className="text-[#D69F04] block">
                Variedad de productos
              </samp>
              <span>Electrodomésticos</span>
            </h1>
            <p className=" mt-4  xl:w-120 text-sm md:text-base xl:text-xl animate__animated  animate__fadeInUp  [animation-delay:0.5s]">
              Lorem ipsum dolor sit amet consectetur adipiscing elit hendrerit
              scelerisque, blandit duis sapien phasellus turpis sem convallis
              imperdiet tempus.
            </p>
          </div>

          <div className="grid relative xl:place-items-start ">
            <h1 className="row-start-1 col-start-1 z-20 font-['Just_Me_Again_Down_Here'] text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-white animate__animated animate__backInDown [animation-delay:1s] mt-4 xl:-mt-4  md:ml-20 xl:ml-20 ">
              Échale Sazón a la Olla
            </h1>

            <img
              src="/images/pot.webp"
              alt="Background"
              fetchPriority="high"
              className="row-start-1 col-start-1 z-10 h-60 md:h-70 lg:h-80 xl:h-110 2xl:h-130 object-cover xl:-mt-14"
            />

            <BottomShadow
              opacity={0.9}
              className="w-[60%]  h-9  bottom-[-2] right-35  md:w-[70%] xl:right-60 xl:w-[70%] xl:bottom-6"
            />

            <BottomShadow
              opacity={0.9}
              className="w-[60%]  h-9  bottom-[10]   right-[-5] md:w-[70%] xl:left-70 xl:w-[70%] xl:bottom-10 "
            />
          </div>

        </div>
      </div>
    </>
  );
}
