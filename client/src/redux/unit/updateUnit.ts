import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { Unit, UnitData, UnitDTO } from '../../models/Unit';
import { UnitState } from './UnitSlice';

export interface UpdateUnitData {
  id: string;
  unit: UnitData;
}


export const updateUnit = createAsyncThunk(
  'units/update',
  async ({id, unit}: UpdateUnitData, thunkAPI): Promise<UpdateUnitData> => {
    
    const status = await ApiClient.updateUnit(id, unit);
  
    return {id, unit};
  },
);
  
export const updateUnitReducers = (builder: ActionReducerMapBuilder<UnitState>) => {

  builder.addCase(updateUnit.pending, (state, action ) => {
    state.loading = true;
  });
  
  builder.addCase(updateUnit.fulfilled, (state, {payload}) => {

    state.loading = false;

    delete state.units[payload.id].relativeUnitId;
    delete state.units[payload.id].relativeQuantity;
    state.units[payload.id] ={
      ...state.units[payload.id],
      ...payload.unit,
      dateUpdated: Date.now(),
    };
  
    // Need to recursively update other units that may use this unit as a reference
    recursiveUpdateQuantities(state.units, state.units[payload.id]);
  });
  
  builder.addCase(updateUnit.rejected, (state, action) => {
    state.loading = false;
  });
      
};

const recursiveUpdateQuantities = (units: {[key: string]: Unit}, unit: Unit)
: {[key: string]: Unit} => {

  // find all units that reference this unit.
  // for each one, update it and call this function on it

  let updatedUnits = units;

  Object.values(units).forEach((v,i) => {
    if(v.relativeUnitId === unit.id){
      const tempUnit = units[v.id];
      if(tempUnit.relativeQuantity){
        units[v.id].quantity = tempUnit.relativeQuantity * unit.quantity;

        // Need to update this
        updatedUnits = recursiveUpdateQuantities(updatedUnits, units[v.id]);
      }
    }
  });

  return updatedUnits;
};