import { Product } from '../../models/Product';

type ProductState = {
    count: number;
    loading: boolean;
    products: {[key: string]: Product};
}

export default ProductState;