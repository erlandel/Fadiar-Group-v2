import MobileOrdes from "@/component/mobileOrdes/mobileOrdes";
import OrdersTable from "@/component/ordersTable/ordersTable";
import { SectionAbout3 } from "@/section/aboutUS/sectionAbout3";
import { SectionAbout4 } from "@/section/aboutUS/sectionAbout4";

export default function Orders() {
  return (
    <>
      <div className="mx-4 xl:px-40 mt-10 md:mt-15">
        <div className="  md:ml-40">
          <h2 className="text-3xl text-primary font-bold">Mis Pedidos</h2>
        </div>

        <div className="md:hidden">
          <MobileOrdes/>
        </div>

        <div className="hidden md:block">
          <OrdersTable />
        </div>
        
      </div>

        <div className="sm:py-20  mt-60 sm:mt-10">
        <SectionAbout3 />
      </div>

      <div className="sm:hidden mt-60">
        <SectionAbout4 />
      </div>
    </>
  );
}
