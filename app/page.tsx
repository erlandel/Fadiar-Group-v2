import "@fontsource/just-me-again-down-here";
import SectionPromoHome1 from "@/section/home/sectionPromoHome1";
import SectionMoreproducts from "@/section/home/sectionMoreproducts";
import SectionPromoHome2 from "@/section/home/sectionPromoHome2";
import { SectionMasRecientes } from "@/section/masRecientes";
import NineOffers from "@/section/NineOffers";



export default function Home() {
  return (
    <>
      <div className="min-h-screen w-full bg-white">

        <div>
          <SectionPromoHome1 />      
        </div>

        <div className="mt-20 lg:mt-0">
          <SectionMoreproducts />
        </div>

        <div className="mt-20 lg:mt-0">
          <NineOffers />
        </div>

        <div className="mt-10 ">
          <SectionPromoHome2/>
        </div>
        
        <div>
          <SectionMasRecientes/>
        </div>
     

      </div>
    </>
  );
}
