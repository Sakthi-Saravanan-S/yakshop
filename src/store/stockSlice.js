import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHerd } from "../api/yakApi"; // Importing API functions
import { calculateMilkProduction, calculateWoolStock } from "../utils"; // Importing utility functions

// Initial state
const initialState = {
  herd: [], // List of Yaks in the herd
  milkStock: 0, // Amount of milk in stock
  woolStock: 0, // Amount of wool in stock
  loading: false, // Loading state for API calls
  error: null, // Error state for API calls
};

// Async Thunks for fetching herd and stock data
export const getHerd = createAsyncThunk("stock/getHerd", async () => {
  const herdData = await fetchHerd(); // Call to fetch herd data
  
  // Calculate milk and wool stock based on the herd
  let totalMilk = 0;
  let totalWool = 0;

  herdData.forEach((yak) => {
    const ageInDays = yak.age * 100;
    // Calculate milk production using the utility function
    const milkProducedPerDay = calculateMilkProduction(ageInDays);
    totalMilk += Math.max(milkProducedPerDay, 0); // Ensure no negative production

    // Calculate wool stock using the utility function
    const woolShaveFrequency = calculateWoolStock(ageInDays);
    totalWool += woolShaveFrequency;
  });

  return { herdData, totalMilk, totalWool };
});

// Slice definition
const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setHerd: (state, action) => {
      state.herd = action.payload;
    },
    setStock: (state, action) => {
      state.milkStock = action.payload.milk;
      state.woolStock = action.payload.wool;
    },
    deductStock: (state, action) => {
      const { milk, wool } = action.payload;
      state.milkStock -= milk;
      state.woolStock -= wool;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching herd data
      .addCase(getHerd.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHerd.fulfilled, (state, action) => {
        state.loading = false;
        state.herd = action.payload.herdData;

        // Update milkStock and woolStock directly here
        state.milkStock = action.payload.totalMilk;
        state.woolStock = action.payload.totalWool;

        console.log("Milk Stock:", state.milkStock);
        console.log("Wool Stock:", state.woolStock);
      })
      .addCase(getHerd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setHerd, setStock, deductStock } = stockSlice.actions;

export default stockSlice.reducer;
