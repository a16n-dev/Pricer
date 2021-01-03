import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { UnitState } from './UnitSlice';

export const deleteUnit = createAsyncThunk(
  'units/delete',
  async (unitId: string, thunkAPI): Promise<string> => unitId,
);

export const deleteUnitReducers = (builder: ActionReducerMapBuilder<UnitState>) => {

  builder.addCase(deleteUnit.pending, (state, action ) => {
    state.loading = true;
  });
  
  builder.addCase(deleteUnit.fulfilled, (state, {payload}) => {
    state.loading = false;
    delete state.units[payload];
  });
  
  builder.addCase(deleteUnit.rejected, (state, action) => {
    state.loading = false;
  });
      
};