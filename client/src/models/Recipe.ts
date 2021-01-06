import { Dated, Owned, Unique } from './Common';

export interface RecipeData {
    name: string;
    servings?: number;
    itemDetail: Array<RecipeItemDetail>;
    lastAnalysis?: RecipeAnalysis;
}

export interface RecipeItemDetail {
    plainText: string;
    detail?: {
        itemText: string;
        quantity: number;
        unitId: string;
        productId: string;
    }
}

export interface RecipeAnalysis {
    date: number;
    cost: number;
    itemsScanned: number;
    itemsSkipped: number;
}

export interface Recipe extends RecipeData, Dated, Unique, Owned {}