import Avatar from "@/component/avatar/avatar";
import PersonalData from "@/component/personalData/personalData";
import { SectionAbout3 } from "@/section/aboutUS/sectionAbout3";
import { SectionAbout4 } from "@/section/aboutUS/sectionAbout4";

export default function MyProfile() {
  return (
    <>
      <div className="mx-4 lg:mx-40 xl:mx-85">
        <div className="mt-10 ">
          <div>
            <h1 className="text-3xl text-primary font-bold ">Mi Perfil</h1>
            <p className="text-[#777777] font-semibold">
              Hola Leydis, aquí puedes gestionar y configurar tu cuenta
            </p>
          </div>

          <div className="mt-10 flex flex-col md:flex-row w-full space-x-10">
            <div className="w-auto py-6 md:py-0 ">
              <Avatar />
            </div>

            <div className="flex-1 mt-6 md:mt-0">
              <PersonalData />
            </div>
          </div>
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
