import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CodeState {
  value: string;
}

const initialState: CodeState = {
  value: "",
};

const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setCode } = codeSlice.actions;

const store = configureStore({
  reducer: {
    code: codeSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
