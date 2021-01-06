import axios from 'axios';
import { Product, ProductData } from '../models/Product';
import { Recipe, RecipeData } from '../models/Recipe';
import { Unit, UnitData } from '../models/Unit';
export class ApiClient {

  static token?: string

  static setToken(token: string) {
    this.token = token;
  }

  static clearToken() {
    delete this.token;
  }

  static async getProducts() {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': this.token},
      url: 'products',
      method: 'get',
    });
    return res.data as Array<Product>;
  }

  static async createProduct(data: ProductData) {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': this.token},
      method: 'post',
      url: 'products/new',
      data,
    });
    return res.data as Product;
  }

  static async createUnit(data: UnitData) {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': this.token},
      method: 'post',
      url: 'units/new',
      data,
    });
    return res.data as Unit;
  }

  static async getUnits() {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': this.token},
      method: 'get',
      url: 'units',
    });
    return res.data as Array<Unit>;
  }

  static async deleteUnit(id: string) {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': this.token},
      method: 'delete',
      url: `/units/${id}`,
    });
    return res.status;
  }

  static async updateUnit(id: string, data: UnitData) {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': this.token},
      method: 'patch',
      url: `/units/${id}`,
      data,
    });
    return res.status;
  }

  static async createRecipe(data: RecipeData) {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': this.token},
      method: 'post',
      url: 'recipes/new',
      data,
    });
    return res.data as Recipe;
  }
  
  static async fetchRecipes() {
    const res = await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': this.token},
      method: 'get',
      url: 'recipes',
    });
    return res.data as Array<Recipe>;
  }

  static async seedDB() {
    return await axios({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {'authorization': this.token},
      method: 'post',
      url: 'seed',
    });
  }
}