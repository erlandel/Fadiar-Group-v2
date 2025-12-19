import "@fontsource/just-me-again-down-here";
import BottomShadow from "@/component/ui/bottomShadow";

export default function SectionPromoHome1() {
  return (
    <>
      <div className="bg-primary w-full h-[380px] xl:h-[400px] relative">

         <div id="lorem" className="absolute text-white top-5 left-5 md:mt-10 xl:top-20  xl:left-10 2xl:left-40 "            >
              <h1 className="text-[28px] sm:text-4xl  xl:text-5xl font-bold  animate__animated  animate__lightSpeedInLeft">
                <samp className="text-[#D69F04] block">
                  Variedad de productos
                </samp>
                <span>Electrodomésticos</span>
              </h1>
              <p className=" mt-4 w-85 xl:w-120 text-sm sm:text-base xl:text-xl animate__animated  animate__fadeInUp  [animation-delay:0.5s]">
                Lorem ipsum dolor sit amet consectetur adipiscing elit hendrerit
                scelerisque, blandit duis sapien phasellus turpis sem convallis
                imperdiet tempus.
              </p>
            </div>


        <div >
          <h1 className="font-['Just_Me_Again_Down_Here'] absolute text-3xl md:text-4xl lg:text-5xl  2xl:text-6xl text-white left-4 sm:left-auto top-55 sm:top-auto sm:bottom-30 sm:right-45 md:bottom-50 md:right-45 lg:bottom-60 right-30 lg:right-70 xl:right-90 xl:bottom-80 animate__animated animate__backInDown  [animation-delay:1s] ">
            Échale Sazón a la Olla
          </h1>

          <img
            src="/images/pot.svg"
            alt="Background"
            fetchPriority="high"
            className="absolute bottom-[-80] lg:bottom-[-170] right-0 md:right-[-70] xl:right-0 w-100 md:w-150 md:bottom-[-120] lg:w-200 xl:w-220   h-auto object-cover "
          />          
         

             <BottomShadow
                    opacity={0.9}
                    className="w-[55%]  h-9 z-10 bottom-[-40] right-35 sm:right-23 md:bottom-[-53]
                     lg:right-45 lg:bottom-[-72]  lg:w-[50%] xl:bottom-[-55] xl:w-[35%] xl:right-80 2xl:right-70" 
                  />

                  
                  <BottomShadow
                    opacity={0.9}
                    className="w-[60%] h-10  z-10 bottom-[-35]   right-0 sm:right-[-60] md:right-[-100]  md:bottom-[-40] 
                    lg:right-[-70] lg:bottom-[-55]  lg:w-[50%] xl:right-14 xl:bottom-[-40] xl:w-[35%] 2xl:right-10 "
                  />
          
               
        </div>
      </div>
    </>
  );
}
