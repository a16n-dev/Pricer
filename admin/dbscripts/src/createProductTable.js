var AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });
var ddb = new AWS.DynamoDB({
    apiVersion: "latest",
    endpoint: "http://localhost:8000"
});
var params = {
    TableName: "PRODUCTS",
    BillingMode: "PAY_PER_REQUEST",
    Tags: [
        {
            Key: "Application",
            Value: "Pricer"
        },
    ],
    AttributeDefinitions: [
        {
            AttributeName: "PRODUCT_ID",
            AttributeType: "N"
        },
        {
            AttributeName: "USER_ID",
            AttributeType: "N"
        },
    ],
    KeySchema: [
        {
            AttributeName: "USER_ID",
            KeyType: "HASH"
        },
        {
            AttributeName: "PRODUCT_ID",
            KeyType: "RANGE"
        },
    ],
    StreamSpecification: {
        StreamEnabled: false
    }
};
ddb.createTable(params, function (err, data) {
    if (err) {
        console.log("Error", err);
    }
    else {
        console.log("Table Created", data);
    }
});
//# sourceMappingURL=createProductTable.js.map