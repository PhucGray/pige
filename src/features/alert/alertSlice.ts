import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Alert } from '../../types';

interface AlertProps {
  alert: Alert | null;
  show: boolean;
}

const initialState: AlertProps = {
  alert: null,
  show: false,
};

const alertSlice = createSlice({
  name: 'slice',
  initialState,
  reducers: {
    showAlert: (state, { payload }: PayloadAction<Alert>) => {
      state.alert = payload;
      state.show = true;
    },
    closeAlert: (state) => {
      state.show = false;
      state.alert = null;
    },
  },
});

export const { showAlert, closeAlert } = alertSlice.actions;
export const selectAlert = (state: RootState) => state.alert;

export default alertSlice.reducer;
