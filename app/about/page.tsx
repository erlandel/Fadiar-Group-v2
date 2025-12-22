import { SectionAbout1 } from "@/section/aboutUS/sectionAbout1";
import { SectionAbout2 } from "@/section/aboutUS/sectionAbout2";
import { SectionAbout3 } from "@/section/aboutUS/sectionAbout3";
import { SectionAbout4 } from "@/section/aboutUS/sectionAbout4";
import { BestSelling } from "@/section/bestSelling/bestSelling";
import { LatestProducts } from "@/section/latestProducts";

const About = () => {
  return (
    <>
      <div>
        <div>
          <SectionAbout1 />
        </div>

        <div className="mt-20">
          <SectionAbout2 />
        </div>

        <div className="mt-8">
          <SectionAbout3 />
        </div>

        <div className="mt-10">
          <SectionAbout4 />
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
