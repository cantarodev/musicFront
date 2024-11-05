import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  results: [],
  totals: {},
};

const reducers = {
  setFilteredResultsAndTotals: (state, action) => {
    state.results = action.payload.results;
    state.totals = action.payload.totals;
  },
};

export const slice = createSlice({
  name: 'filteredResults',
  initialState,
  reducers,
});

export const { setFilteredResultsAndTotals } = slice.actions;

export const { reducer } = slice;
