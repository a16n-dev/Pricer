export default interface CreateProductResponse {
    productId: string;
    name: string;
    brand?: string;
    description?: string;
    cost: number;
    quantity: number;
    units: string;
}