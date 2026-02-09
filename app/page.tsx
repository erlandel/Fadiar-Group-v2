"use client";

import "@fontsource/just-me-again-down-here";
import BannerPot from "@/components/banner/bannerPot";
import SectionMoreproducts from "@/sections/home/sectionMoreproducts";
import BannerUpcomingProducts from "@/components/banner/bannerUpcomingProducts";
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

        <div className="mt-25 sm:mt-0">
          <LatestProducts />
        </div>

        <div>
          <NineOffers />
        </div>

        <div>
          <BannerUpcomingProducts />
        </div>

        <div>
          <BestSelling />
        </div>

        <div>
          <SectionMoreproducts />
        </div>
      </div>
    </>
  );
}
