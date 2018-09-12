// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var apiCredential = JSON.parse(context.getVariable('apiProducts'));

//{"ApiProducts":{"ApiProduct":{"Name":"helloworld","Status":"approved"}}}
//{"ApiProducts":{"ApiProduct":[{"Name":"httpbin product","Status":"approved"},{"Name":"Edgemicro hello","Status":"approved"}]}}
var apiProducts = apiCredential.Credential.ApiProducts;

var apiProductsList = [];
try {

    if (Array.isArray(apiProducts.ApiProduct)) {
        apiProducts.ApiProduct.forEach(function(apiProduct) {
            apiProductsList.push(apiProduct.Name);
        });
    } else {
        apiProductsList.push(apiProducts.ApiProduct.Name);
    }
} catch (err) {
    if (apiProducts && apiProducts.ApiProduct.Name) {
        apiProductsList.push(apiProducts.ApiProduct.Name);
    }
}

var scope = context.getVariable("oauthv2accesstoken.AccessTokenRequest.scope");
if (scope) {
    var scopearr = scope.split(" ");
    context.setVariable("scope", scopearr.join());
}

context.setVariable("apiProductList", apiProductsList.join());
context.setVariable("nbf", new Date().toUTCString());
context.setVariable("iss", context.getVariable("proxyProto") + "://" + context.getVariable("proxyHost") + context.getVariable("proxy.basepath") + context.getVariable("proxy.pathsuffix"));
context.setVariable("jti", 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
}));

