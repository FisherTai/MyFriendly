import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Flags } from "../../utils/untils";

/**當前通訊錄的選中標籤 */
interface contactsTabState {
  value: number;
}

const initialState: contactsTabState = {
  value: Flags.TAB_CONTACT,
};

export const contactsTabSlice = createSlice({
  name: "contactsTab",
  initialState,
  reducers: {
    setContactsTab: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setContactsTab } = contactsTabSlice.actions;

export default contactsTabSlice.reducer;
