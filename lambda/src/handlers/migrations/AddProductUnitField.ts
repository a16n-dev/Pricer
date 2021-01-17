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

export const AddProductUnitField: APIGatewayProxyHandler = (
  event,
  context,
  callback
) => {

  let userId = event.requestContext.authorizer.claims?.sub;

  if (!userId) {
    if (offline) {
      userId = "1";
    } else {
      callback(null, {
        statusCode: 401,
        headers,
        body: "No congito user found",
      });
    }
  }

  docClient.scan(
    {
      TableName: "PRODUCTS",
    },
    (err, data) => {

      if(err){
        callback(err)
      }

      const items: Array<Product> = data.Items as any;

      //Process data here
      const res = items.map((i) => {
        i['units'] = []

        const req = {
          PutRequest: {
            Item: i,
          },
        };
        return req;
      });

      //Consolidate items into batches of 25
      const consolodated = []

      res.forEach((v, i) => {
        consolodated[Math.floor(i/25)] = [...(consolodated[Math.floor(i/25)] || []), v]
      })

      let opsNum = consolodated.length
      console.log(opsNum);

      consolodated.forEach(v => {
        docClient.batchWrite(
          {
            RequestItems: {
              PRODUCTS: res,
            },
            ReturnItemCollectionMetrics: "SIZE",
          },
          (err, data) => {
            if (err) {
              callback(err);
            }
            if (data) {
              opsNum--;
              if(opsNum === 0){
                //if all operations have completed then return
                callback(null, {
                  statusCode: 200,
                  body: 'Success',
                });
              }
              
            }
          }
        );
      })

    }
  );
};
