import Link from "next/link";

export const AboutInformation = () => {
  return (
    <>
      <div className="px-4 md:px-6 xl:px-10 2xl:px-20">
        <div className=" mt-10">
          <p className="text-xs text-gray-400 mb-4">
            <Link href="/" className="text-gray-400 cursor-pointer">
              Inicio -{" "}
            </Link>
            <span className="text-primary font-semibold">Sobre Nosotros</span>
          </p>
          <h1 className="text-3xl text-primary font-bold">Sobre Nosotros</h1>
        </div>

        <div className="flex flex-col xl:flex-row items-stretch justify-between gap-5 sm:gap-10  my-5 text-sm sm:text-lg lg:text-xl 3xl:text-2xl">
          <div className="xl:w-2/3 flex flex-col text-justify">
            <div className="h-full flex flex-col ">

              {/* <div className="hidden xl:block">
              <p>
                <span className="text-primary font-bold">Grupo Fadiar </span>
                es una empresa con trayectoria de dos años, marcada por un
                crecimiento constante y una visión clara: elevar los estándares
                de calidad, innovación y funcionalidad en cada proyecto que
                desarrollamos. Desde nuestra fundación hemos tenido un
                compromiso inquebrantable con la excelencia, impulsados por la
                convicción de que cada solución que ofrecemos debe mejorar la
                vida de las personas y transformar hogares en espacios más
                eficientes, cómodos y adaptados a las necesidades. Nuestra
                evolución ha sido dinámica y estratégica, logrando adaptarnos
                con agilidad a las tendencias del mercado. Hemos fortalecido
                nuestros procesos mediante una gestión operativa rigurosa y
                optimizado nuestra capacidad productiva para garantizar
                resultados superiores. Este enfoques disciplinado y orientado a
                la mejora continua nos han permitido consolidarnos como una
                empresa confiable con diversidad de solicitudes, pero un solo
                compromiso que, con los más altos estándares, superan
                consistentemente las expectativas de nuestros clientes.
              </p>

              <p className="mt-5">
                Entendemos que cada hogar es único, por eso trabajamos con
                dedicación y precisión para convertirnos en el aliado
                estratégico que los clientes necesitan, con el objetivo de
                ofrecer productos que aporten valor real, integren tecnología y
                diseño y contribuyan a crear entornos más prácticos y
                armoniosos. Hoy reafirmamos nuestra misión: seguir creciendo,
                innovando y construyendo un bienestar a través de soluciones
                integrales que marcan la diferencia. Trabajamos para que cada
                proyecto sea una oportunidad de transformar espacios y mejorar
                vidas.
              </p>
              </div> */}

                <div  >
                     <p>
                <span className="text-primary font-bold">Grupo Fadiar </span>
                es una empresa en crecimiento, enfocada en ofrecer
                soluciones innovadoras que elevan la calidad, funcionalidad y
                confort de los hogares y espacios de trabajo. Desde nuestra
                fundación, trabajamos con un firme compromiso hacia la
                excelencia, integrando tecnología, diseño y eficiencia en cada
                proyecto que desarrollamos. Nuestra evolución ha sido dinámica y
                estratégica, fortaleciendo procesos productivos y operativos que
                nos permiten garantizar resultados confiables y productos de
                alto estándar. 
              </p>

              <p className="mt-5">
                Esto nos ha consolidado como una empresa cercana,
                responsable y orientada a superar las expectativas de nuestros
                clientes. Entendemos que cada espacio es único. Por eso,
                ofrecemos soluciones prácticas, modernas y adaptadas a las
                necesidades reales de las personas, contribuyendo a crear
                entornos más cómodos, visión que guía nuestro crecimiento
                continuo.
              </p>
                  
                </div>
           

              {/* <p className="mt-7">
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
              </p> */}
            </div>
          </div>

          <div className="xl:w-1/3 flex ">
            <img
              src="/images/worker.webp"
              alt="dealer"
              className="w-full h-full object-cover object-top hidden xl:block"
            />

            <img
              src="/images/workerMobile.webp"
              alt="dealer"
              className="w-full h-full  object-cover object-top xl:hidden "
            />
          </div>
        </div>
      </div>
    </>
  );
};
