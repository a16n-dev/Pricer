"use strict";

import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Recipe, RecipeAnalysis, RecipeData, RecipeItemDetail } from "../models/Recipe";

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

export const getRecipes: APIGatewayProxyHandler = (
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

  docClient.query(
    {
      ExpressionAttributeValues: {
        ":u": `${userId}`,
      },
      KeyConditionExpression: "userId = :u",
      TableName: "RECIPES",
    },
    (err, data) => {
      if (err) {
        callback(null, {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            message: "An error occurred",
            error: err,
          }),
        });
      } else {
        callback(null, {
          statusCode: 200,
          headers,
          body: JSON.stringify(data.Items),
        });
      }
    }
  );
};

export const addRecipe: APIGatewayProxyHandler = (event, context, callback) => {
  const data: RecipeData = JSON.parse(event.body || "{}");
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

  const Item: Recipe = {
    id: `${uuidv4()}`,
    userId: `${userId}`,
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    ...data,
  };

  docClient.put(
    {
      TableName: "RECIPES",
      Item,
    },
    (err, data) => {
      if (err) {
        callback(null, {
          statusCode: 400,
          headers,
          body: JSON.stringify(err),
        });
      }
      if (data) {
        const response: Recipe = Item;
        callback(null, {
          statusCode: 201,
          headers,
          body: JSON.stringify(response),
        });
      }
    }
  );
};

export const addIngredients: APIGatewayProxyHandler = (
  event,
  context,
  callback
) => {
  const data: Array<RecipeItemDetail> = JSON.parse(event.body || "{}");
  let unitId = event.pathParameters["id"];
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

  docClient.update(
    {
      TableName: "RECIPES",
      Key: {
        id: unitId,
        userId: userId,
      },
      UpdateExpression: "SET itemDetail = list_append(itemDetail, :i)",
      ExpressionAttributeValues: {
        ":i": data,
      },
      ReturnValues: "UPDATED_NEW",
    },
    (err, data) => {
      if (err) {
        callback(null, {
          statusCode: 400,
          headers,
          body: JSON.stringify(err),
        });
      }
      if (data) {
        callback(null, {
          statusCode: 201,
          headers,
          body: JSON.stringify(data.Attributes.itemDetail),
        });
      }
    }
  );
};

export const setIngredients: APIGatewayProxyHandler = (
  event,
  context,
  callback
) => {
  const data: Array<RecipeItemDetail> = JSON.parse(event.body || "{}");
  let unitId = event.pathParameters["id"];
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

  docClient.update(
    {
      TableName: "RECIPES",
      Key: {
        id: unitId,
        userId: userId,
      },
      UpdateExpression: "SET itemDetail = :i, dateUpdated = :d",
      ExpressionAttributeValues: {
        ":i": data,
        ':d': Date.now(),
      },
      ReturnValues: "UPDATED_NEW",
    },
    (err, data) => {
      if (err) {
        callback(null, {
          statusCode: 400,
          headers,
          body: JSON.stringify(err),
        });
      }
      if (data) {
        callback(null, {
          statusCode: 201,
          headers,
          body: JSON.stringify(data.Attributes.itemDetail),
        });
      }
    }
  );
};

export const setAnalysis: APIGatewayProxyHandler = (
  event,
  context,
  callback
) => {
  const data: Array<RecipeAnalysis> = JSON.parse(event.body || "{}");
  let unitId = event.pathParameters["id"];
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

  docClient.update(
    {
      TableName: "RECIPES",
      Key: {
        id: unitId,
        userId: userId,
      },
      UpdateExpression: "SET lastAnalysis = :a",
      ExpressionAttributeValues: {
        ":i": data,
      }
    },
    (err, data) => {
      if (err) {
        callback(null, {
          statusCode: 400,
          headers,
          body: JSON.stringify(err),
        });
      }
      if (data) {
        callback(null, {
          statusCode: 201,
          headers,
          body: 'success',
        });
      }
    }
  );
};
