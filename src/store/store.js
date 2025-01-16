import { configureStore } from "@reduxjs/toolkit";
import stockReducer from "./stockSlice";
import orderReducer from "./orderSlice";
import themeReducer from "./themeSlice";

const store = configureStore({
  reducer: {
    stock: stockReducer,
    order: orderReducer,
    theme: themeReducer,
  },
});

export default store;
