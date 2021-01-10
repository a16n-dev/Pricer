import { Dated, Owned, Unique } from './Common';

// defined fields
export interface ProductData {
    name: string;
    brand?: string;
    description?: string;
    cost: number;
    quantity: number;
    unitId: string;
    density: number;
}

// Includes defined and generated fields
export interface Product extends ProductData, Dated, Unique, Owned {}
