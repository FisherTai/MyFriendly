import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../config/interface";

interface currentChatState {
  value: IUser | null;
}

const initialState: currentChatState = {
  value: null,
};

export const currentChatSlice = createSlice({
  name: "currentChat",
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<IUser | null>) => {
      state.value = action.payload;
      console.log("setCurrentChat:" + state.value?._id);
    },
  },
});

export const { setCurrentChat } = currentChatSlice.actions;

export default currentChatSlice.reducer;
