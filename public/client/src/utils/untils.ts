import { strings } from "../config/strings";
import { IUser } from "../config/interface";

export const isDaylightMode = (): boolean => {
  if (!localStorage.getItem(strings.LOCAL_STORAGE_STYLE_MODE)) {
    return true;
  }

  return (
    localStorage.getItem(strings.LOCAL_STORAGE_STYLE_MODE) ===
    strings.STYLE_MODE_DAYLIGHT
  );
};

export const getLocalStorageUser = () => {
  const user: IUser | null = JSON.parse(getLocalStorageUserString()!);
  return user;
};

export const setLocalStorageUser = (user: IUser): void => {
  localStorage.setItem(strings.LOCAL_STORAGE_USER, JSON.stringify(user));
};

export const getLocalStorageUserString = () => {
  return localStorage.getItem(strings.LOCAL_STORAGE_USER);
};
