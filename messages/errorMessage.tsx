
import { toast } from "react-toastify";

const ErrorMessage = (message: string) => {
  toast.error(message, {
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

export default ErrorMessage;
