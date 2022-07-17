import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../config/interface";

/**當前通訊錄列表 */
interface contactsListState {
  value: IUser[];
}

const initialState: contactsListState = {
  value: [],
};

export const contactsListSlice = createSlice({
  name: "contactsList",
  initialState,
  reducers: {
    setContactsList: (state, action: PayloadAction<IUser[]>) => {
      state.value = action.payload;
    },
    addContactsUser: (state, action: PayloadAction<IUser>) => {
      state.value = [...state.value, action.payload];
    },
    removeContactsUser: (state, action: PayloadAction<IUser>) => {
      state.value = state.value.filter((item) => {
        return item._id !== action.payload._id;
      });
    },
    clearContactsList: (state) => {
      state.value = [];
    },
  },
});

export const { setContactsList, addContactsUser, removeContactsUser, clearContactsList } = contactsListSlice.actions;

export default contactsListSlice.reducer;
