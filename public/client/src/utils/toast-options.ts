import { ToastOptions } from "react-toastify";
import { isDaylightMode } from "./untils";

export const darkToast: ToastOptions<{}> = {
  position: "bottom-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export const lightToast: ToastOptions<{}> = {
  position: "bottom-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const toastOptions = () => {
  return isDaylightMode() ? lightToast : darkToast;
};

export default toastOptions;
