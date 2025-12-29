import { IxErrorFilled } from "@/icons/icons";

interface MessageErrorAuthProps {
  message: string;
  icon?: React.ReactNode;
  center?: boolean;
  className?: string;
}

export default function MessageErrorAuth({
  message,
  icon,
  center = false,
  className,
}: MessageErrorAuthProps) {
  const defaultClasses =
    "flex items-center gap-1 border border-red-200 bg-red-50 text-red-600 rounded-lg px-3 py-4";

  return (
    <div
      className={
        className ??
        `${defaultClasses} ${center ? "justify-center" : ""}`
      }
    >
      {icon || <IxErrorFilled className="w-5 h-5 shrink-0" />}
      <span
        className={`${center ? "text-center" : "flex-1"} text-red-700 text-xs sm:text-sm`}
      >
        {message}
      </span>
    </div>
  );
}
