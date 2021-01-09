import { Product } from '../../models/Product';

type ProductState = {
    count: number;
    loading: boolean;
    products: {[key: string]: Product};
    isHydrated: boolean;
}

export default ProductState;