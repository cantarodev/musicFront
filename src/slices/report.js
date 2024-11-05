import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const reducers = {
  setReport: (state, action) => action.payload,
  resetReport: () => initialState,
};

export const slice = createSlice({
  name: 'report',
  initialState,
  reducers,
});

export const { setReport, resetReport } = slice.actions;

export const { reducer } = slice;
