import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  userID: string;
  isLoading: boolean;
}

const initialState: InitialState = {
  userID: "",
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.userID = action.payload;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.userID = "";
      state.isLoading = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
