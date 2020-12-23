var AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });
var ddb = new AWS.DynamoDB({
    apiVersion: "latest",
    endpoint: "http://localhost:8000"
});

ddb.getItem({
    TableName: 'PRODUCTS',
    Key: {
        'PRODUCT_ID': {N: '1'},
        "USER_ID": {N: '1'},
    }
}, (err, data) => {
    if(err){
        console.log(err);
    }
    if(data){
        console.log(data);
    }
})