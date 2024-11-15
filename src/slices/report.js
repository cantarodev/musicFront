import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sales: [],
  purchases: [],
};

const reducers = {
  setSalesReport: (state, action) => {
    state.sales = action.payload;
  },
  setPurchasesReport: (state, action) => {
    state.purchases = action.payload;
  },
  resetSalesReport: (state) => {
    state.sales = [];
  },
  resetPurchasesReport: (state) => {
    state.purchases = [];
  },
};

export const slice = createSlice({
  name: 'report',
  initialState,
  reducers,
});

export const { setSalesReport, setPurchasesReport, resetSalesReport, resetPurchasesReport } =
  slice.actions;

export const { reducer } = slice;
