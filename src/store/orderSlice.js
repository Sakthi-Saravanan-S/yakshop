import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { placeOrder, fetchOrderHistory } from "../api/yakApi";

const initialState = {
  orderHistory: [],
  orderStatus: "",
  orderError: null,
  loading: false,
};

export const placeCustomerOrder = createAsyncThunk(
  "order/placeCustomerOrder",
  async ({ milk, wool, date, id, milkCost, woolCost, totalCost }, { getState }) => {
    const { stock } = getState();

    if (milk > stock.milkStock) {
      throw new Error("Insufficient milk stock.");
    }
    if (wool > stock.woolStock) {
      throw new Error("Insufficient wool stock.");
    }

    const orderData = await placeOrder(milk, wool, date, id, milkCost, woolCost, totalCost);

    return orderData;
  }
);

export const getOrderHistory = createAsyncThunk("order/getOrderHistory", async () => {
  const orderHistory = await fetchOrderHistory();
  return orderHistory;
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.orderStatus = "";
      state.orderError = null;
      state.loading = false;
    },
    addOrderToHistory: (state, action) => {
      state.orderHistory.push(action.payload);
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
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        if (state.orderHistory.length === 0) {
          state.orderHistory = action.payload.map((order) => ({
            ...order,
            orderStatus: "completed"
          }));
        }
      });
  },
});

export const { resetOrderState, addOrderToHistory } = orderSlice.actions; // Export addOrderToHistory
export default orderSlice.reducer;
