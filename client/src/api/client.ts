import axios from 'axios';
import { stat } from 'fs';
import { Product, ProductData } from '../models/Product';
import { Unit, UnitData } from '../models/Unit';
import store from '../redux/store';

export class ApiClient {

  static async createProduct(data: ProductData) {
    const res = await axios({
      baseURL: process.env.API_URL,
      headers: {'authorization': store.getState().auth.token},
      method: 'post',
      url: 'products/new',
      data,
    });
    return res.data as Product;
  }

  static async getProducts() {
    console.log(process.env.REACT_APP_API_URL);
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': store.getState().auth.token},
      method: 'get',
      url: 'products',
    });
    return res.data as Array<Product>;
  }

  static async createUnit(data: UnitData) {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': store.getState().auth.token},
      method: 'post',
      url: 'units/new',
      data,
    });
    return res.data as Unit;
  }

  static async getUnits() {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': store.getState().auth.token},
      method: 'get',
      url: 'units',
    });
    return res.data as Array<Unit>;
  }
}