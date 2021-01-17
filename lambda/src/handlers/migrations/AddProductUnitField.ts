"use strict";

import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import { Product } from "../../models/Product";

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

export const AddProductUnitField: APIGatewayProxyHandler = (event, context, callback) => {

  if (!offline) {
    callback(null, {
      statusCode: 400,
      body: "Migration lambda functions must be run directly",
    });
  }

    docClient.scan(
      {
        TableName: "PRODUCTS",
      },
      (err, data) => {
        const items: Array<Product> = data.Items as any

        //Process data here
        const res = items.map((i) => {

            const item =  {
                ...i,
                units: []
            }

            const req = {
                PutRequest: {
                    Item: item
                }
            }
            return req
        })

        docClient.batchWrite({
            RequestItems: {
                'PRODUCTS': res
            },
            ReturnItemCollectionMetrics: 'SIZE'
        }, (err, data) => {
          if(err){
            callback(err)
          }
          if(data){
            callback(null, {
              statusCode: 200,
              body: JSON.stringify(data.ItemCollectionMetrics)
            })
          }
        })
      }
    );
};
