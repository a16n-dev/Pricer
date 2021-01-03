'use strict';

import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductData } from "../models/Product";
import { Unit, UnitData } from "../models/Unit";

AWS.config.update({ region: "ap-southeast-2" });

const offline = process.env.IS_OFFLINE

const options =  {
  region: "localhost",
  endpoint: "http://localhost:8000"
};

var docClient = new AWS.DynamoDB.DocumentClient(offline ? options : {});

const headers = {
  "Access-Control-Allow-Headers" : "Content-Type",
  "Access-Control-Allow-Origin": "*",
}

export const getUnits : APIGatewayProxyHandler  = (event, context, callback) => {

  let userId = event.requestContext.authorizer.claims.sub

  if(!userId){
    if(offline){
      userId = '1';
    } else {
      callback(null, {
        statusCode: 401,
        headers,
        body: 'No congito user found'
      })
    }
  }

  docClient.query({
    ExpressionAttributeValues: {
      ':u': `${userId}`,
     },
   KeyConditionExpression: 'userId = :u',
   TableName: 'UNITS'
  }, (err, data) => {
    if (err) {
        callback (null, {
            statusCode: 400,
            headers,
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
            headers,
            body: JSON.stringify(
              data.Items
            ),
          });
        }
  });
}


export const addUnit : APIGatewayProxyHandler = (event, context, callback) => {

  const data: UnitData = JSON.parse(event.body || '{}')
  let userId = event.requestContext.authorizer.claims.sub

  if(!userId){
    if(offline){
      userId = '1';
    } else {
      callback(null, {
        statusCode: 401,
        headers,
        body: 'No congito user found'
      })
    }
  }

  const Item: Unit = {
    id: `${uuidv4()}`,
    userId: `${userId}`,
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    ...data
  }

  docClient.put({
    TableName: 'UNITS',
    Item
  }, (err, data) => {
    if(err) {
      callback(null, {
        statusCode: 400,
        headers,
        body: JSON.stringify(err)
      })
    }
    if(data) {
      const response: Unit = Item 
      callback(null, {
        statusCode: 201,
        headers,
        body: JSON.stringify(response)
      })
    }
  })
} 