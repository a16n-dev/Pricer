import { Dated, Owned, Unique } from "./Common";

// defined fields
export interface UnitData {
    name: string;
	symbol: string;
	base: 0 | 1;
	relativeUnitId?: string;
	relativeQuantity?: number;
	quantity: number;
}

// Includes defined and generated fields
export interface Unit extends UnitData, Dated, Unique, Owned {}

// DTO for update operations where all fields are optional
export type UnitDTO = Partial<UnitData>