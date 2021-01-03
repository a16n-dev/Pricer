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

export const getUnits: APIGatewayProxyHandler = (event, context, callback) => {
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
      TableName: "UNITS",
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

export const addUnit: APIGatewayProxyHandler = (event, context, callback) => {
  const data: UnitData = JSON.parse(event.body || "{}");
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

  const Item: Unit = {
    id: `${uuidv4()}`,
    userId: `${userId}`,
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    ...data,
  };

  docClient.put(
    {
      TableName: "UNITS",
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
        const response: Unit = Item;
        callback(null, {
          statusCode: 201,
          headers,
          body: JSON.stringify(response),
        });
      }
    }
  );
};

export const deleteUnit: APIGatewayProxyHandler = (
  event,
  context,
  callback
) => {
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

  docClient.delete(
    {
      TableName: "UNITS",
      Key: {
        userId,
        id: unitId,
      },
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
          statusCode: 200,
          headers,
          body: "successfully deleted unit",
        });
      }
    }
  );
};

/**
 * This method handles updating a unit. Most of the complexity of this comes from allowing a unit to define itself based on another unit.
 * This creates a tree structure of unit dependencies. As such we must validate that updating the unit will not introduce any cycles into the
 * dependency tree. Additionally once these checks have passed we have to recursively update the units that depend on this unit.
 */
export const updateUnit: APIGatewayProxyHandler = (
  event,
  context,
  callback
) => {
  let active = 0;
  let totalCount = 0;
  const recursiveUpdateQuantities = (units: Array<Unit>, unit: Unit) => {
    // find all units that reference this unit.
    // for each one, update it and call this function on it

    //for each unit
    Object.values(units).forEach((v, i) => {
      //if that unit references the target
      if (v.relativeUnitId === unit.id) {
        active++;
        //need to update y
        docClient.update(
          {
            TableName: "UNITS",
            Key: {
              id: v.id,
              userId: v.userId,
            },
            UpdateExpression: "set quantity = :q",
            ExpressionAttributeValues: {
              ":q": v.relativeQuantity * unit.quantity,
            },
            ReturnValues: "ALL_NEW",
          },
          (err, data) => {
            if (data) {
              totalCount++;
              const newUnit: Unit = data.Attributes as any;

              recursiveUpdateQuantities(units, newUnit);

              active--;
              if (active === 0) {
                callback(null, {
                  statusCode: 200,
                  body: `Successfully updated ${totalCount} dependencies`,
                });
              }
            }
          }
        );
      }
    });
    if(active === 0) {
      callback(null, {
        statusCode: 200,
        body: `No dependencies to update`,
      });
    }
  };

  const unitData: UnitData = JSON.parse(event.body || "{}");
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

  //fetch list of all units
  docClient.query(
    {
      ExpressionAttributeValues: {
        ":u": `${userId}`,
      },
      KeyConditionExpression: "userId = :u",
      TableName: "UNITS",
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
      }
      if (data) {
        const units: Array<Unit> = data.Items as any;
        const item = units.find((e) => e.id === unitId);

        //create updated item
        let unit: Unit = {
          id: item["id"],
          userId: item["userId"],
          dateCreated: item["dateCreated"],
          dateUpdated: Date.now(),
          ...unitData,
        };

        //dont allow self reference
        if (unit.id === unit.relativeUnitId) {
          callback(null, {
            statusCode: 400,
            body: "Unit cannot reference itself",
          });
        } else {
          //check for a cycle. This is important to avoid infinite update looks
          const hasCycle = checkCycles(units, unit, unit.id);
          if (hasCycle) {
            callback(null, {
              statusCode: 400,
              body:
                "Unit cannot reference its own child in the dependency tree",
            });
          } else {
            //If this point is reached all validation checks have passed and db updates can be done
            docClient.put(
              {
                TableName: "UNITS",
                Item: unit,
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
                }
                //now need to recursive update.
                recursiveUpdateQuantities(units, unit);
              }
            );
          }
        }
      }
    }
  );
};

const checkCycles = (
  units: Array<Unit>,
  check: Unit,
  targetId: string
): boolean => {
  if (check.relativeUnitId) {
    //if unit has a reference
    if (check.relativeUnitId === targetId) {
      return true;
    } else {
      //find the ref of the current check
      const newCheck = units.find((u) => u.id === check.relativeUnitId);
      return checkCycles(units, newCheck, targetId);
    }
  } else {
    return false;
  }
};
