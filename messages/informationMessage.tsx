
import { toast } from "react-toastify";

const InformationMessage = (message: string) => {
  toast.info(message, {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export default InformationMessage;
