import axios from 'axios';
import { Product, ProductData } from '../models/Product';
import { Unit, UnitData, UnitDTO } from '../models/Unit';
import store from '../redux/store';

export class ApiClient {

  static async getProducts() {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': store.getState().auth.token},
      url: 'products',
      method: 'get',
    });
    return res.data as Array<Product>;
  }

  static async createProduct(data: ProductData) {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': store.getState().auth.token},
      method: 'post',
      url: 'products/new',
      data,
    });
    return res.data as Product;
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

  static async deleteUnit(id: string) {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': store.getState().auth.token},
      method: 'delete',
      url: `/units/${id}`,
    });
    return res.status;
  }

  static async updateUnit(id: string, data: UnitData) {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': store.getState().auth.token},
      method: 'patch',
      url: `/units/${id}`,
      data,
    });
    return res.status;
  }
}