'use strict';

import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';
import CreateProductRequest from "../dto/products/CreateProductRequest";
import {cognitoAuth, globalCognitoAuth, httpGET, httpPOST} from '../../slsa/annontations'
import ProductResponse from "../dto/products/ProductResponse";

AWS.config.update({ region: "ap-southeast-2" });

const offline = process.env.IS_OFFLINE

const options =  {
  region: "localhost",
  endpoint: "http://localhost:8000"
};

globalCognitoAuth('apiAuthorizer')

var docClient = new AWS.DynamoDB.DocumentClient(offline ? options : {});

httpGET('products')
export const getProducts : APIGatewayProxyHandler  = (event, context, callback) => {

  let userId = context.identity?.cognitoIdentityId;

  if(!userId){
    if(offline){
      userId = '1';
    } else {
      callback('No cognitoIdentityId found')
    }
  }

  docClient.query({
    ExpressionAttributeValues: {
      ':u': `${userId}`,
     },
   KeyConditionExpression: 'userId = :u',
   TableName: 'PRODUCTS'
  }, (err, data) => {
    if (err) {
        callback (null, {
            statusCode: 400,
            body: JSON.stringify(
              {
                message: 'An error occurred',
                error: err,
              }
            ),
          });
    } else {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(
              {
                data
              }
            ),
          });
        }
  });
}

httpPOST<CreateProductRequest>('products/new')
export const addProduct : APIGatewayProxyHandler = (event, context, callback) => {

  const data: CreateProductRequest = JSON.parse(event.body || '{}')
  let userId = context.identity?.cognitoIdentityId;

  if(!userId){
    if(offline){
    } else {
      callback('No cognitoIdentityId found')
    }
  }

  const Item = {
    "productId": `${uuidv4()}`,
    "userId": `${userId}`,
    ...data
  }

  docClient.put({
    TableName: 'PRODUCTS',
    Item
  }, (err, data) => {
    if(err) {
      callback(null, {
        statusCode: 400,
        body: JSON.stringify(err)
      })
    }
    if(data) {
      const response: ProductResponse = Item 
      callback(null, {
        statusCode: 201,
        body: JSON.stringify(response)
      })
    }
  })
} 