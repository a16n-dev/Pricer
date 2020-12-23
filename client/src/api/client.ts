interface IProductClient {
  createProduct: (req: createProductRequest) => boolean;
}

const productClient : IProductClient = {
  createProduct: (req) => {
    console.log(req);
    return true;
  },
};

export {
  productClient,
};

export interface createProductRequest {
  name: string;
  brand?: string;
  description?: string;
  cost: number;
  quantity: number;
  unit: string;
}