 /*
 * Copyright 2016 Apigee Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

 // Load the http module to create an http server.
var http = require('http');
var apigee = require('apigee-access');
var jwt = require('jsonwebtoken');
var port = process.env.PORT || 10010;

var err =  {
	"error":"invalid_request",
	"error_description": "invalid request"
};

var token = {

};

var options = {
  algorithm: 'RS256',
  expiresIn: 0
};

var server = http.createServer(function (request, response) {

  var certificate = apigee.getVariable(request,'private.privateKey');

  token.api_product_list = apigee.getVariable(request, 'apiProductList');
  token.audience = 'microgateway';
  token.jti = apigee.getVariable(request, 'jti');
  token.iss = apigee.getVariable(request, "iss");
  token.access_token = apigee.getVariable(request, 'apigee.access_token');
  token.client_id = apigee.getVariable(request, 'apigee.client_id');
  
  try {
    if ((request.url == "/refresh" || request.url == "/token") && request.method == "POST") {
      token.application_name = apigee.getVariable(request, 'AccessEntity.ChildNodes.Access-App-Info.App.AppId');
      token.scopes = apigee.getVariable(request, 'scope');
      options.expiresIn = apigee.getVariable(request, 'token_expiry');
    } else if (request.url == "/verifyApiKey" && request.method == "POST") {
    token.application_name = apigee.getVariable(request, 'apigee.developer.app.name');  
    } else {
      response.writeHead(404, {"Content-Type": "application/json"});
      response.end(JSON.stringify(err));  	
    }
    var signed_token = {
      "token": jwt.sign(token, certificate, options)
    };
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(signed_token));  	
  } catch (err) {
  	response.writeHead(500, {"Content-Type": "application/json"});
  	response.end(JSON.stringify(err));  	
  }
});

server.listen(port);
