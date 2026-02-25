 "use client";
import "@fontsource/just-me-again-down-here";
import { useEffect, useRef, useState } from "react";

export default function BannerPot() {
  const images = [
    "/images/imagesPot/Ollas.png",
    "/images/imagesPot/Calderos.png",
    "/images/imagesPot/Estación.png",
  ];
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const exitTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % images.length;
        setPrevIndex(prev);
        if (exitTimeoutRef.current) {
          clearTimeout(exitTimeoutRef.current);
        }
        exitTimeoutRef.current = window.setTimeout(() => {
          setPrevIndex(null);
        }, 1000);
        return next;
      });
    }, 10000);
    return () => {
      clearInterval(id);
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, [images.length]);

  return (
    <>
      <div className="grid h-[400px] sm:h-[360px] md:h-[320px] lg:h-[300px] xl:h-[360px]  2xl:h-[400px]  ">
        <div className="bg-[url('/images/Banner.jpg')] bg-cover bg-center w-full h-[380px] sm:h-[360px] md:h-[280px] lg:h-[300px] xl:h-[360px]  2xl:h-[380px] row-start-1 col-start-1"></div>

        <div className="z-10  mt-8 row-start-1 col-start-1 flex flex-col md:flex-row items-center justify-between  gap-2 mx-4 xl:mx-10 2xl:mx-20">
     
          <div id="lorem" className=" text-white md:mb-30 md:w-5/9 lg:w-4/9   ">
            <h1 className="text-2xl sm:text-[28px] md:text-2xl  xl:text-4xl 2xl:text-[40px] font-bold  animate__animated  animate__lightSpeedInLeft">
              <samp className="text-[#D69F04] block  ">
                Diversidad de soluciones
              </samp>
              <span> para cada espacio de tu hogar</span>
            </h1>
            <p className=" mt-4 leading-snug sm:leading-normal xl:mt-8  xl:w-135 text-md  xl:text-xl animate__animated  animate__fadeInUp  [animation-delay:0.5s]">
              Ponemos a tu alcance una amplia gama de electrodomésticos que
              combinan tecnología, funcionalidad y diseño para crear un hogar
              más eficiente para el día a día.
            </p>
          </div>

         <div className="grid h-full items-end">
            {images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt="Background"
                fetchPriority="high"
                className={`row-start-1 col-start-1 h-60 md:h-60 lg:h-80 xl:h-110 2xl:h-110 object-cover mt-1 ${
                  i === index
                    ? "block animate__animated animate__zoomIn z-20 [animation-duration:2s] [animation-timing-function:ease-in-out]"
                    : i === prevIndex
                    ? "block animate__animated animate__zoomOut z-10 [animation-duration:2s] [animation-timing-function:ease-in-out]"
                    : "hidden"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

