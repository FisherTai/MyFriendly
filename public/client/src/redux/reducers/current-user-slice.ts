import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../config/interface";
import { getLocalStorageUser } from "../../utils/untils";

interface currentUserState {
  value: IUser | null;
}

const initialState: currentUserState = {
  value: getLocalStorageUser(),
};

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<IUser | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;
