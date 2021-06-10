/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_CONTROLECONTINUODYNAMO_ARN
	STORAGE_CONTROLECONTINUODYNAMO_NAME
Amplify Params - DO NOT EDIT *//*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

// from REST API + DynamoDB template
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
var app = express()
/*var cors = require('cors') // ADDED - for avoiding CORS in local dev
app.use(cors())  // ADDED - for avoiding CORS in local dev*/
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())
app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

let tableControle = "controleContinuoDynamo";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableControle = tableControle + '-' + process.env.ENV;
}

/* 1. Import the AWS SDK and create an instance of the DynamoDB Document Client */
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient();

/**********************
 * Example get method *
 **********************/

 app.get('/device', function (req, res) {
  var params = {
    TableName: tableControle // TODO: UPDATE THIS WITH THE ACTUAL NAME OF THE FORM TABLE ENV VAR (set by Amplify CLI)
  }
  docClient.scan(params, function (err, data) {
    if (err) res.json({ err })
    else res.json({ data })
  })
});

/*
app.get('/device', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/device/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});
*/
/****************************
* Example post method *
****************************/
/*
app.post('/device', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/device/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});
*/
/****************************
* Example put method *
****************************/
/*
app.put('/device', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/device/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});
*/
/****************************
* Example delete method *
****************************/
/*
app.delete('/device', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/device/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});
*/
app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
