import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../config/interface";

/**當前聊天的房間 */
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
    },
    clearCurrentChat: (state) => {
      state.value = null;
    },
  },
});

export const { setCurrentChat, clearCurrentChat } = currentChatSlice.actions;

export default currentChatSlice.reducer;
