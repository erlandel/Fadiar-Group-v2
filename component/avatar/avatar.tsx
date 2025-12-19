import { MaterialIconThemeDependenciesUpdate } from "@/icons/icons";
import { RefreshCcw, RefreshCw } from "lucide-react";


export default function Avatar() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div>
          <h5 className="text-primary font-bold text-xl">Avatar</h5>
        </div>

        <div className="relative mt-4">
          <img
            src="/images/avatar.jpg"
            alt="avatar"
            className="w-40 h-40 rounded-full"
          />
          <div className="absolute bottom-0 right-0 bg-[#F5A51D] rounded-full p-2">
        

            <MaterialIconThemeDependenciesUpdate />

          </div>
        </div>
      </div>
    </>
  );
}
