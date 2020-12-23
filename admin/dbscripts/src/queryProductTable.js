var AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });
var docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: "latest",
    endpoint: "http://localhost:8000"
});

 
  docClient.query({
    ExpressionAttributeValues: {
      ':u': 1,
     },
   KeyConditionExpression: 'USER_ID = :u',
   TableName: 'PRODUCTS'
  }, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.Items);
    }
  });