import { Dated, Owned, Unique } from './Common';

// defined fields
export interface ProductData {
    name: string;
    brand?: string;
    description?: string;
    cost: number;
    quantity: number;
    unitId: string;
}

// Includes defined and generated fields
export interface Product extends ProductData, Dated, Unique, Owned {}

// DTO for update operations where all fields are optional
export type ProductDTO = Partial<ProductData>