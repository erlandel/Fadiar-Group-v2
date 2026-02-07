
import { toast } from "react-toastify";

const WarningMenssage = (message: string) => {
  toast.warning(message, {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    position: "top-right",
    style: { backgroundColor: "#022854" },
  });
};

export default WarningMenssage;
