import {
  createAsyncThunk,
  createSlice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { ApiClient } from '../api/client';
import { Unit, UnitData, UnitDTO } from '../models/Unit';


export type UnitState = {
    count: number;
    loading: boolean;
    units: {[key: string]: Unit};
}

export interface UpdateUnitData {
  id: string;
  unit: UnitData;
}

export const createUnit = createAsyncThunk(
  'units/create',
  async (unitData: UnitData, thunkAPI): Promise<Unit> => {
    const unit = await ApiClient.createUnit(unitData);

    return unit;
  },
);

export const updateUnit = createAsyncThunk(
  'units/update',
  async (unitData: UpdateUnitData, thunkAPI): Promise<{id: string, data: UnitDTO}> => {
    const unit: UnitDTO = {
      ...unitData.unit,
    };

    console.log(unit);

    return {
      data: unit,
      id: unitData.id,
    };
  },
);

export const deleteUnit = createAsyncThunk(
  'units/delete',
  async (unitId: string, thunkAPI): Promise<string> => unitId,
);

export const fetchUnits = createAsyncThunk(
  'units/fetch',
  async (): Promise<Array<Unit>> => {

    const units = await ApiClient.getUnits();
    return units;
  },
);

const UnitSlice = createSlice<UnitState, SliceCaseReducers<UnitState>>({
  name: 'units',
  initialState: {
    count: 0,
    loading: false,
    units: {},
  },
  reducers: {
   
  },
  extraReducers: builder => {
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

    builder.addCase(updateUnit.pending, (state, action ) => {
      state.loading = true;
    });

    builder.addCase(updateUnit.fulfilled, (state, {payload}) => {
      state.loading = false;
      delete state.units[payload.id].relativeUnitId;
      delete state.units[payload.id].relativeQuantity;
      state.units[payload.id] ={
        ...state.units[payload.id],
        ...payload.data,
        dateUpdated: Date.now(),
      };

      // Need to recursively update other units that may use this unit as a reference
      recursiveUpdateQuantities(state.units, state.units[payload.id]);
    });

    builder.addCase(updateUnit.rejected, (state, action) => {
      state.loading = false;
    });

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

    builder.addCase(fetchUnits.fulfilled, (state, {payload}) => {

      state.units = payload.reduce((map: any, p) => {
        map[p.id] = p;
        return map;
      }, {});
      state.count = Object.keys(state.units).length;
    });
  },
});

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
  
// Extract the action creators object and the reducer
const { actions, reducer } = UnitSlice;

// Extract and export each action creator by name
// export const { CreateProduct, updateProduct, deleteProduct } = actions;

// Export the reducer, either as a default or named export
export default reducer;