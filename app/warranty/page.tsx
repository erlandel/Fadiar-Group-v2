import Accordion from "@/components/accordion/accordion";
import { warrantyPolicy } from "@/data/warrantyPolicy";

const Warranty = () => {
  return (
    <>
     <div className="px-4 md:px-25 2xl:px-28 mb-50">
      
         <div className="mt-10">
          <p className="text-xs text-gray-400 mb-4">
            <span className="text-gray-400">Inicio - </span>
            <span className="text-primary font-semibold">Garantía</span>
          </p>
          <h1 className="text-3xl text-primary font-bold mb-8">Garantía</h1>
        </div>

      <section className="mt-10">
        <div className="flex flex-col lg:flex-row justify-center gap-5 w-full">
          <div className="lg:w-1/3 md:mt-22 flex flex-col">
            <h1 className="text-3xl font-bold w-full">
              <span className="block text-primary">
                Política de Garantía de{" "}
              </span>
              <span className="text-[#F5A623]">Electrodomésticos</span>
            </h1>
          </div>

          <div className="mt-4 lg:w-2/3">
            <Accordion items={warrantyPolicy} />
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Warranty;
