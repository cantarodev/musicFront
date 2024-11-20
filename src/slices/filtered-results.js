import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  purchases: {
    results: [],
    totals: {},
  },
  sales: {
    results: [],
    totals: {},
  },
};

const reducers = {
  setFilteredPurchases: (state, action) => {
    state.purchases.results = action.payload.results;
    state.purchases.totals = action.payload.totals;
  },
  setFilteredSales: (state, action) => {
    state.sales.results = action.payload.results;
    state.sales.totals = action.payload.totals;
  },
};

export const slice = createSlice({
  name: 'filteredResults',
  initialState,
  reducers,
});

export const { setFilteredPurchases, setFilteredSales } = slice.actions;

export const { reducer } = slice;
