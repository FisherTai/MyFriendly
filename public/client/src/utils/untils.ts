import { strings } from "../config/strings";

export const isDaylightMode = (): boolean => {
  
  if (!localStorage.getItem(strings.LOCAL_STORAGE_STYLE_MODE)) {
    return true;
  }

  return (
    localStorage.getItem(strings.LOCAL_STORAGE_STYLE_MODE) ===
    strings.STYLE_MODE_DAYLIGHT
  );
};
