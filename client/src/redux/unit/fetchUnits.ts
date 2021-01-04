import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { Unit } from '../../models/Unit';
import UnitState from './unitState';


export const fetchUnits = createAsyncThunk(
  'units/fetch',
  async (): Promise<Array<Unit>> => {
  
    const units = await ApiClient.getUnits();
    return units;
  },
);

export const fetchUnitsReducers = (builder: ActionReducerMapBuilder<UnitState>) => {

  builder.addCase(fetchUnits.fulfilled, (state, {payload}) => {

    state.units = payload.reduce((map: any, p) => {
      map[p.id] = p;
      return map;
    }, {});
    state.count = Object.keys(state.units).length;
  });

};