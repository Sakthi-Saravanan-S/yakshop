import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { placeOrder } from "../api/yakApi";

const initialState = {
  orderHistory: [], // Initialize the orderHistory array
  orderStatus: "",
  orderError: null,
  loading: false,
};

export const placeCustomerOrder = createAsyncThunk(
  "order/placeCustomerOrder",
  async ({ milk, wool }, { getState }) => {
    const { stock } = getState(); // Get current stock from state

    if (milk > stock.milkStock) {
      throw new Error("Insufficient milk stock.");
    }
    if (wool > stock.woolStock) {
      throw new Error("Insufficient wool stock.");
    }

    // Place order logic (you can call an API here)
    const orderData = await placeOrder(milk, wool);

    return orderData;
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.orderStatus = "";
      state.orderError = null;
      state.loading = false;
    },
    // Add the action for updating the order history
    addOrderToHistory: (state, action) => {
      state.orderHistory.push(action.payload); // Add the new order to the history
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeCustomerOrder.pending, (state) => {
        state.loading = true;
        state.orderStatus = "";
        state.orderError = null;
      })
      .addCase(placeCustomerOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.orderStatus = "Order placed successfully!";
        } else {
          state.orderError = action.payload.message || "Order failed.";
        }
      })
      .addCase(placeCustomerOrder.rejected, (state, action) => {
        state.loading = false;
        state.orderError = action.error.message || "Failed to place the order.";
        state.orderStatus = "";
      });
  },
});

export const { resetOrderState, addOrderToHistory } = orderSlice.actions; // Export addOrderToHistory
export default orderSlice.reducer;
