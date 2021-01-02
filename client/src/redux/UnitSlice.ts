import {
  createAsyncThunk,
  createSlice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { Product, Unit } from '../models/models';
import { v4 as uuidv4 } from 'uuid';


export type UnitState = {
    count: number;
    loading: boolean;
    units: {[key: string]: Unit};
}

export interface CreateUnitData {
    name: string;
    symbol: string;
    base: 0 | 1;
    relativeUnitId?: string;
    relativeQuantity?: number;
    quantity: number;
}

export interface UpdateUnitData {
  id: string;
  unit: CreateUnitData;
}

export const createUnit = createAsyncThunk(
  'units/create',
  async (unitData: CreateUnitData, thunkAPI): Promise<Unit> => {
    const unit: Unit = {
      id: uuidv4(),
      dateCreated: new Date(),
      dateModified: new Date(),
      ...unitData,
    };

    console.log(unit);

    return unit;
  },
);

export const updateUnit = createAsyncThunk(
  'units/update',
  async (unitData: UpdateUnitData, thunkAPI): Promise<{id: string, data: Partial<Unit>}> => {
    const unit: Partial<Unit> = {
      ...unitData.unit,
      dateModified: new Date(),
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