import { IxErrorFilled } from "@/icons/icons";


interface MessageErrorAuthProps {
  message: string;
  icon?: React.ReactNode; // opcional, por si quieres otro icono
}

export default function MessageErrorAuth({ message, icon }: MessageErrorAuthProps) {
  return (
    <div className="flex items-center gap-2 border border-red-200 bg-red-50 text-red-600 rounded-lg  px-3 py-5">
      {/* Icono */}
      {icon || <IxErrorFilled className="w-6 h-6 shrink-0" />}

      {/* Mensaje */}
      <span className="flex-1 text-red-700 font-bold text-sm sm:text-xl ">{message}</span>
    </div>
  );
}
