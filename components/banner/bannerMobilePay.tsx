export const BannerMobilePay = () => {
  return (
    <>
      <div className="bg-[url('/images/methodPaymentVersion_Mobile.webp')] xl:bg-[url('/images/methodPaymentVersion_Desktop.webp')] bg-cover bg-center bg-no-repeat  h-90 sm:h-110 w-full">

        <div className="flex flex-col md:flex-row items-center justify-center h-full mx-4 xl:mx-0 ">
          <div
            className="animate-on-scroll  text-2xl md:text-3xl lg:text-4xl  xl:text-5xl md:w-140 lg:w-150 xl:w-170 font-bold relative z-10 "
            data-animate="animate__backInLeft"
            
          >
            <h1 className="">
              <span className="text-accent text-3xl md:text-4xl lg:text-5xl xl:text-6xl block">
                Pague de forma Segura
              </span>{" "}
              <span className="text-white block">
                Presencial, en efectivo
              </span>
                <span className="text-white">
               o transferencia
              </span>
            </h1>
          </div>

          <div className=" md:-ml-15 xl:-ml-5 sm:mt-10 ">
            <img
              className="animate-on-scroll  [animation-delay:0.5s] h-50 sm:h-70  md:h-85 lg:h-auto"
              data-animate="animate__zoomIn"
              src="/images/Ilustración.webp"
              alt="Ilustración"
            />
          </div>
        </div>
      </div>
    </>
  );
};
