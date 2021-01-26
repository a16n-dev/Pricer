import { Dated, Owned, Unique } from './Common';
import {Unit} from './Unit';
// defined fields
export interface ProductData {
    name: string;
    brand?: string;
    description?: string;
    cost: number;
    quantity: number;
    unitId: string;
    density: number;
    units: Array<Unit>;
}

// Includes defined and generated fields
export interface Product extends ProductData, Dated, Unique, Owned {}
