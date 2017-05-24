 /*
  * Copyright 2017 Apigee Corporation.
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
 var http = require("http");
 var apigee = require("apigee-access");
 var rs = require("jsrsasign");
 var jws = require("jws");
 var port = process.env.PORT || 10010;

 var err = {
     "error": "invalid_request",
     "error_description": "invalid request"
 };

 var token = {

 };

 // Header
 var jwtHeader = {
     alg: "RS256",
     typ: "JWT"
 };

 var server = http.createServer(function(request, response) {

     var privateKey = apigee.getVariable(request, "private.privateKey");
     var tstamp = rs.KJUR.jws.IntDate.get('now');
     
     //check for custom claims
     var customClaims = JSON.parse(apigee.getVariable(request, "claims")) || null;
     if (customClaims) {
         token = customClaims;
     }

     token.api_product_list = apigee.getVariable(request, "apiProductList");
     token.audience = "microgateway";
     token.jti = apigee.getVariable(request, "jti");
     token.iss = apigee.getVariable(request, "iss");
     token.access_token = apigee.getVariable(request, "apigee.access_token");
     token.client_id = apigee.getVariable(request, "apigee.client_id");
     token.nbf = tstamp;
     token.iat = tstamp;
     
     try {
         if (request.url == "/publicKey" && request.method == "GET") {
             response.writeHead(200, {
                 "Content-Type": "text/plain"
             });
             response.end("");
         }
         else if ((request.url == "/refresh" || request.url == "/token") && request.method == "POST") {
             token.application_name = apigee.getVariable(request, "AccessEntity.ChildNodes.Access-App-Info.App.AppId");
             token.scopes = apigee.getVariable(request, "scope");
             token.exp = tstamp + parseInt(apigee.getVariable(request, "token_expiry"));
         } else if (request.url == "/verifyApiKey" && request.method == "POST") {
             token.application_name = apigee.getVariable(request, "apigee.developer.app.name");
             token.exp = tstamp + 300;//hard code expiry
         } else if (request.url == "/jwkPublicKeys" && request.method == "GET") {
             var publicKey1 = apigee.getVariable(request, "private.publicKey1");
             var publicKey2 = apigee.getVariable(request, "private.publicKey2");
             var certificatelist = {};

             certificatelist.keys = [];

             if (!publicKey1) {
                 response.writeHead(500, {
                     "Content-Type": "application/json"
                 });
                 response.end(JSON.stringify(err));
             } else {
                 var key1 = rs.KEYUTIL.getKey(publicKey1);
                 var jwk1 = rs.KEYUTIL.getJWKFromKey(key1);
                 certificatelist.keys.push(jwk1);
                 if (publicKey2) {
                     var key2 = rs.KEYUTIL.getKey(publicKey2);
                     var jwk2 = rs.KEYUTIL.getJWKFromKey(key2);
                     certificatelist.keys.push(jwk2);
                 }
                 response.writeHead(200, {
                     "Content-Type": "application/json"
                 });
                 response.end(JSON.stringify(certificatelist));
             }

         } else {
             response.writeHead(404, {
                 "Content-Type": "application/json"
             });
             response.end(JSON.stringify(err));
         }
         var prvKeyObj = rs.KEYUTIL.getKey(privateKey);
         var signed_token = {
             "token": jws.sign({header: { alg: 'RS256' }, payload: token, secret: privateKey})
             //rs.jws.JWS.sign("RS256", JSON.stringify(jwtHeader), token, prvKeyObj)
         };
         response.writeHead(200, {
             "Content-Type": "application/json"
         });
         response.end(JSON.stringify(signed_token));
     } catch (error) {
         response.writeHead(500, {
             "Content-Type": "application/json"
         });
         response.end(JSON.stringify(error));
     }
 });

 server.listen(port);
