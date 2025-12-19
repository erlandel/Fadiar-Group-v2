import Image from 'next/image';

export const SectionAbout2 = () => {
  return (
    <>
      <div className="relative w-full md:h-72">
        <Image
          src="/images/group-mobile.png"
          alt="Background"
          fill
          className="object-cover object-center md:hidden"
          priority
        />
        <Image
          src="/images/group.png"
          alt="Background"
          fill
          className="object-cover object-center hidden md:block"
          priority
        />
        <div className="w-full h-full flex items-center text-white px-4 md:px-20">

            <div
            
            className="w-full gap-10 md:gap-0 py-10 md:py-0 flex flex-col md:flex-row justify-around ">
                <div data-animate="animate__zoomIn" id="1" className=" md:w-52 animate-on-scroll">
            <h4 className="text-accent text-3xl font-bold">18.6k</h4>
            <p>
                Lorem ipsum Sit amet consectetur.  vel sit id at.
            </p>
           </div>

           <div data-animate="animate__zoomIn" id="2" className=" md:w-52 animate-on-scroll">
            <h4 className="text-accent text-3xl font-bold">98%</h4>
            <p>
               Lorem ipsum Sit amet consectetur. At tristique est adipiscing pellentesque vel sit id at.
            </p>
           </div>

           <div data-animate="animate__zoomIn" id="3" className=" md:w-52 animate-on-scroll">
            <h4 className="text-accent text-3xl font-bold">234+</h4>
            <p>
                Lorem ipsum Sit amet consectetur.
            </p>
           </div>

           <div data-animate="animate__zoomIn" id="4" className=" md:w-52 animate-on-scroll">
            <h4 className="text-accent text-3xl font-bold">63.6k</h4>
            <p>
                Lorem ipsum Sit amet consectetur. At pellentesque vel sit id at.
            </p>
           </div>

            </div>
           
           

        </div>
      </div>
    </>
  );
};
