import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { UnitState } from './UnitSlice';

export const deleteUnit = createAsyncThunk(
  'units/delete',
  async (unitId: string, thunkAPI): Promise<string> => {
    const res = await ApiClient.deleteUnit(unitId);
    if(res === 200){
      return unitId;
    } else {
      throw new Error();
    }
  });

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