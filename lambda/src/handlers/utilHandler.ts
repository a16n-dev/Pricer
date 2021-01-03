"use strict";

import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Product, ProductData } from "../models/Product";
import { Unit, UnitData, UnitDTO } from "../models/Unit";

AWS.config.update({ region: "ap-southeast-2" });

const offline = process.env.IS_OFFLINE;

const options = {
  region: "localhost",
  endpoint: "http://localhost:8000",
};

var docClient = new AWS.DynamoDB.DocumentClient(offline ? options : {});

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const heartbeat: APIGatewayProxyHandler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: "API is online",
  });
};

export const seedDB: APIGatewayProxyHandler = (event, context, callback) => {
  if (!offline) {
    callback(null, {
      statusCode: 400,
      body: "Cant seed test data in prod",
    });
  }

  const units: Array<UnitData> = [
    {
      name: "teaspoon",
      symbol: "tsp",
      base: 1,
      quantity: 5,
    },
    {
      name: "tablespoon",
      symbol: "tbsp",
      base: 1,
      relativeUnitId: "0",
      relativeQuantity: 3,
      quantity: 15,
    },
    {
      name: "cup",
      symbol: "cup",
      base: 1,
      relativeUnitId: "1",
      relativeQuantity: 16,
      quantity: 240,
    },
  ];


  let completed = 0
  units.forEach((d, i) => {
    let item: Unit = {
      id: `${i}`,
      userId: "1",
      dateCreated: 1,
      dateUpdated: 1,
      ...d,
    };

    docClient.put({
      TableName: "UNITS",
      Item: item,
    }, () => {
        completed++;
        if(completed == units.length){
            callback(null, {
                statusCode: 201,
                body: 'successfully seeded db'
            })
        }
    });
  });
};
