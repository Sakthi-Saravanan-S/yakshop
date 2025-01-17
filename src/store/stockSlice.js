import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHerd } from "../api/yakApi";
import { calculateMilkProductionPerDay, calculateWoolStock } from "../utils";

const initialState = {
  herd: [],
  milkStock: 0,
  woolStock: 0,
  loading: false,
  error: null,
};

export const getHerd = createAsyncThunk("stock/getHerd", async () => {
  const herdData = await fetchHerd();
  let totalMilk = 0;
  let totalWool = 0;

  herdData.forEach((yak) => {
    const ageInDays = yak.age * 100;
    const milkProducedPerDay = calculateMilkProductionPerDay(ageInDays);
    totalMilk += Math.max(milkProducedPerDay, 0);
    const woolProducedPerYak = calculateWoolStock(ageInDays);
    totalWool += woolProducedPerYak;
  });

  return { herdData, totalMilk, totalWool };
});

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
      .addCase(getHerd.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHerd.fulfilled, (state, action) => {
        state.loading = false;
        state.herd = action.payload.herdData;
        state.milkStock = action.payload.totalMilk;
        state.woolStock = action.payload.totalWool;
      })
      .addCase(getHerd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setHerd, setStock, deductStock } = stockSlice.actions;

export default stockSlice.reducer;
