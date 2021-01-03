import {
  createSlice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { Unit } from '../../models/Unit';
import { createUnitReducers } from './createUnit';
import { deleteUnitReducers } from './deleteUnit';
import { fetchUnitsReducers } from './fetchUnits';
import { updateUnitReducers } from './updateUnit';


export type UnitState = {
    count: number;
    loading: boolean;
    units: {[key: string]: Unit};
}


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
    createUnitReducers(builder);
    deleteUnitReducers(builder);
    fetchUnitsReducers(builder);
    updateUnitReducers(builder);
  },
});


  
// Extract the action creators object and the reducer
const { reducer } = UnitSlice;

// Extract and export each action creator by name
// export const { CreateProduct, updateProduct, deleteProduct } = actions;

// Export the reducer, either as a default or named export
export default reducer;