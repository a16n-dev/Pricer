interface Dated {
    dateCreated: Date;
    dateModified: Date;
}

interface Unique {
    id: string;
}

export interface Product extends Dated, Unique {
    name: string;
    brand?: string;
    description?: string;
    cost: number;
    quantity: number;
    units: string;
}

export interface Unit extends Dated, Unique {
    name: string;
	symbol: string;
	base: 0 | 1;
	relativeUnitId?: string;
	relativeQuantity?: number;
	quantity: number;
}