import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sales: [],
  purchases: [],
  missings: [],
};

const reducers = {
  setSalesReport: (state, action) => {
    state.sales = action.payload;
  },
  setPurchasesReport: (state, action) => {
    state.purchases = action.payload;
  },
  setMissingsReport: (state, action) => {
    state.missings = action.payload;
  },
  resetSalesReport: (state) => {
    state.sales = [];
  },
  resetPurchasesReport: (state) => {
    state.purchases = [];
  },
  resetMissingsReport: (state) => {
    state.missings = [];
  },
};

export const slice = createSlice({
  name: 'report',
  initialState,
  reducers,
});

export const {
  setSalesReport,
  setPurchasesReport,
  setMissingsReport,
  resetSalesReport,
  resetPurchasesReport,
  resetMissingsReport,
} = slice.actions;

export const { reducer } = slice;
