import { SectionAbout1 } from "@/section/aboutUS/sectionAbout1";
import { SectionAbout2 } from "@/section/aboutUS/sectionAbout2";
import { SectionAbout3 } from "@/section/aboutUS/sectionAbout3";
import { SectionAbout4 } from "@/section/aboutUS/sectionAbout4";
import { SectionMasRecientes } from "@/section/masRecientes";


const About = () => {
  return (
    < >
    <div >
        <div >
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
      <div className="mt-10">
        <SectionMasRecientes />
      </div>
    </div>
    
    </>
  );
};

export default About;
