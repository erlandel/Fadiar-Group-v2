export const SectionAbout1 = () => {
  return (
    <>
      <div className="px-4 md:px-25 2xl:px-28">
        <div className=" mt-10">
          <p className="text-xs text-gray-400 mb-4">
            <span className="text-gray-400">Home - </span>
            <span className="text-primary font-semibold">About Us</span>
          </p>
          <h1 className="text-3xl text-primary font-bold">About Us</h1>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-5 sm:gap-20 2xl:gap-25 my-5 text-sm sm:text-lg">
          <div className="lg:w-2/3 flex flex-col">
            <div className="h-full flex flex-col justify-between">
              <p>
                <span className="text-primary font-bold">Grupo Fadiar </span>
                Sit amet consectetur. At tristique est adipiscing pellentesque
                vel sit id at. Malesuada congue bibendum pretium faucibus orci
                sit urna. Turpis mattis tortor eget egestas diam natoque
                ultrices ornare lectus. Tortor viverra condimentum vestibulum
                commodo. Sed proin dictum risus in nam.
              </p>
              <p className="mt-7">
                Sit amet consectetur. At tristique est adipiscing pellentesque
                vel sit id at. Malesuada congue bibendum pretium faucibus orci
                sit urna. Turpis mattis tortor eget egestas diam natoque
                ultrices ornare lectus. Tortor viverra condimentum vestibulum
                commodo. Sed proin dictum risus in nam.
              </p>
              <p className="mt-7">
                Sit amet consectetur. At tristique est adipiscing pellentesque
                vel sit id at. Malesuada congue bibendum pretium faucibus orci
                sit urna. Turpis mattis tortor eget egestas diam natoque
                ultrices ornare lectus. Tortor viverra condimentum vestibulum
                commodo. Sed proin dictum risus in nam. Sit amet consectetur. At
                tristique est adipiscing pellentesque vel sit id at. Malesuada
                congue bibendum pretium faucibus orci sit urna. Turpis mattis
                tortor eget egestas diam natoque ultrices ornare lectus. Tortor
                viverra condimentum vestibulum commodo. Sed proin dictum risus
                in nam.
              </p>
              <p className="mt-7">
                Para más información sobre la empresa matriz consulte el
                siguiente sitio web:
                <a
                  href="https://www.fadiar.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent font-bold cursor-pointer"
                >
                  {" "}
                  www.fadiar.com
                </a>
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 flex items-center">
            <img
              src="/images/dealer.png"
              alt="dealer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};
