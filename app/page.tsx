"use client";

import "@fontsource/just-me-again-down-here";
import BannerPot from "@/components/banner/bannerPot";
import SectionMoreproducts from "@/sections/home/sectionMoreproducts";
import BannerEngine from "@/components/banner/bannerEngine";
import NineOffers from "@/sections/sectionsProducts/NineOffers";
import { LatestProducts } from "@/sections/sectionsProducts/latestProducts";
import { BestSelling } from "@/sections/sectionsProducts/bestSelling";

export default function Home() {
  return (
    <>
      <div className="min-h-screen w-full bg-white">

        <div>
          <BannerPot />      
        </div>

        <div className="mt-20 sm:mt-0">
          <SectionMoreproducts />
        </div>


        <div className="mt-20 lg:mt-0">
          <NineOffers />
        </div>

        <div className="mt-10 ">
          <BannerEngine/>
        </div>
        
        <div>
          <LatestProducts/>
        </div>
     
     <div>
      <BestSelling/>
     </div>

      </div>
    </>
  );
}
