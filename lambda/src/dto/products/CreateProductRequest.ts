export default interface CreateProductRequest {
    name: string;
    brand?: string;
    description?: string;
    cost: number;
    quantity: number;
    units: string;
}