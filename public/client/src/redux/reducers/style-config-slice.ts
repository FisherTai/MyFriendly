import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { strings } from "../../config/strings";
import { IStyleMode, IColor } from "../../config/style-mode-interface";
import { isDaylightMode } from "../../utils/untils";
const colorsJstr: IStyleMode = require("../../config/style-mode.json");

interface styleConfigState {
  value: IColor;
}

const initialState: styleConfigState = {
  value: isDaylightMode() ? colorsJstr.daylight : colorsJstr.night,
};

export const styleConfigSlice = createSlice({
  name: "styleConfig",
  initialState,
  reducers: {
    changeStyles: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload ? colorsJstr.night : colorsJstr.daylight;
      localStorage.setItem(
        strings.LOCAL_STORAGE_STYLE_MODE,
        action.payload ? strings.STYLE_MODE_NIGHT : strings.STYLE_MODE_DAYLIGHT
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeStyles } = styleConfigSlice.actions;

export default styleConfigSlice.reducer;
