import { AboutInformation } from "@/sections/aboutUS/aboutInformation";
import { BannerWorkersFadiar } from "@/components/banner/bannerWorkersFadiar";
import { SectionMobile } from "@/sections/sectionMobile";
import { BannerMobilePay } from "@/components/banner/bannerMobilePay";
import { BestSelling } from "@/sections/sectionsProducts/bestSelling";
import { LatestProducts } from "@/sections/sectionsProducts/latestProducts";

const About = () => {
  return (
    <>
      <div>
        <div>
          <AboutInformation />
        </div>

        <div className="mt-20">
          <BannerWorkersFadiar />
        </div>

        <div className="mt-8">
          <SectionMobile />
        </div>

        <div className="mt-10">
          <BannerMobilePay />
        </div>

        <div className="hidden xl:block mt-10">
          <LatestProducts />
        </div>

        <div className="xl:hidden">
          <BestSelling />
        </div>
        
      </div>
    </>
  );
};

export default About;
