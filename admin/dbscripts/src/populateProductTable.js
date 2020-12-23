var AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });
var docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: "latest",
    endpoint: "http://localhost:8000"
});

docClient.put({
    TableName: 'PRODUCTS',
    Item: {
        "PRODUCT_ID": '3',
        "USER_ID": '1',
        "NAME": "Peanut butter",
        "UNITS": "kg",
        "COST": '40',
        "QUANTITY": '50',
    }
}, (err, data) => {
    if(err){
        console.log(err);
    }
    if(data){
        console.log(data);
    }
})