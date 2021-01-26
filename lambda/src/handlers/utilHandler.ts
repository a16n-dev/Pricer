"use strict";

import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import { Unique } from "../models/Common";
import { Product, ProductData } from "../models/Product";
import { Unit, UnitData } from "../models/Unit";

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

  const units: Array<UnitData & Unique> = [
    {
      id: '0',
      name: "teaspoon",
      symbol: "tsp",
      base: 1,
      quantity: 5,
    },
    {
      id: '1',
      name: "tablespoon",
      symbol: "tbsp",
      base: 1,
      relativeUnitId: "0",
      relativeQuantity: 3,
      quantity: 15,
    },
    {
      id: '2',
      name: "cup",
      symbol: "cup",
      base: 1,
      relativeUnitId: "1",
      relativeQuantity: 16,
      quantity: 240,
    },
  ];

  const products: Array<ProductData & Unique> = [
    {
      id: '0',
      name: "Flour",
      cost: 1,
      quantity: 200,
      unitId: "1",
      density: 1,
      units: [
        {
          symbol: 'customUnit',
          dateCreated: 1,
          quantity: 5,
          name: 'customUnit',
          id: 'FLOUR-0',
          userId: '1',
          dateUpdated: 1,
          base: 1
        }
      ],
    },
    {
      id: '1',
      name: "Butter",
      cost: 6.5,
      quantity: 2,
      unitId: "2",
      density: 1,
      units: [],
    },
  ];
  let total = units.length + products.length
  let completed = 0;

  units.forEach((d, i) => {
    let item: Unit = {
      userId: "1",
      dateCreated: 1,
      dateUpdated: 1,
      ...d,
    };

    docClient.put(
      {
        TableName: "UNITS",
        Item: item,
      },
      () => {
        completed++;
        if (completed == total) {
          callback(null, {
            statusCode: 201,
            body: "successfully seeded db",
          });
        }
      }
    );
  });

  products.forEach((d, i) => {
    let item: Product = {
      userId: "1",
      dateCreated: 1,
      dateUpdated: 1,
      ...d,
    };

    docClient.put(
      {
        TableName: "PRODUCTS",
        Item: item,
      },
      () => {
        completed++;
        if (completed == total) {
          callback(null, {
            statusCode: 201,
            body: "successfully seeded db",
          });
        }
      }
    );
  });
};
