import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { Unit, UnitData } from '../../models/Unit';
import UnitState from './unitState';

export const createUnit = createAsyncThunk(
  'units/create',
  async (unitData: UnitData, thunkAPI): Promise<Unit> => {
    const unit = await ApiClient.createUnit(unitData);
  
    return unit;
  },
);

export const createUnitReducers = (builder: ActionReducerMapBuilder<UnitState>) => {

  builder.addCase(createUnit.pending, (state, action ) => {
    state.loading = true;
  });
  
  builder.addCase(createUnit.fulfilled, (state, {payload}) => {
    state.loading = false;
    state.units[payload.id] = payload;
    state.count = Object.keys(state.units).length;
  });
  
  builder.addCase(createUnit.rejected, (state, action) => {
    state.loading = false;
  });
      
};