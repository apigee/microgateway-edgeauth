# edgemicro-auth
edgemicro-auth is an open source project that implements the edgemicro-auth Apigee Edge proxy.

When configuring [Apigee Edge Microgateway](http://docs.apigee.com/microgateway/content/edge-microgateway-home) (please refer to docs [here](http://docs.apigee.com/microgateway/latest/edge-microgateway-tutorial#Part1)), an
Apigee Edge proxy called edgemicro-auth gets install on the org and environment.

The edgemicro-auth proxy provides four functions:
* Provides a list of all products in the org (/products)
* Provides a signed JWT if the API Key is valid (/verifyApiKey)
* Provides the public key that can be used to validate the JWT (/publicKey)
* Generates an access token, which is a signed JWT. Supports client_credentials grant type (/token)

## Purpose
The original implementation is node.js implementation which leverages volos plugins and Apigee a127.
If no customizations are needed, then this implementation works just fine. Customizations that users
frequently ask for include:
* Include additional/custom claims to JWT
* Support for other grant types
* Support for refresh tokens
* Set custom expiry on tokens

Some of these customizations would have been been possible by modifying the node.js implementation,
this project reimplements the edgemicro-auth the ENTIRE implementation using Apigee Edge policies.
In addition to a 1:1 implementation, the customizations mentioned above are also implemented.

## Support
This is an open-source project of the Apigee Corporation. It is not covered by Apigee support contracts.
However, we will support you as best we can. For help, please open an issue in this GitHub project.
You are also always welcome to submit a pull request.

### Certificate management and Setup
The original implementation of of edgemicro-auth uses Apigee's [secure storage](docs.apigee.com/api-services/content/using-secure-store).
However, this implementation uses KVM entries to store public-key and private-key. The proxy expects a mapIdentifier called 'microgateway'
Contained within the 'microgateway' is one entry called 'publicKey' with the RSA public key and one entry called 'privateKey'
with one entry called 'privateKey'


### Customizations

#### How do I set custom expiry?
In the flow named 'Obtain Access Token' you'll find an Assign Message Policy called 'Create OAuth Request'. Change the value here
```
<AssignVariable>
    <Name>token_expiry</Name>
    <Value>300000</Value>
</AssignVariable>
```

#### How do I add or modify claims?
The "Obtain Access Token" flow has a assign message policy called "Add Custom Claims". This policy is disabled by default.
After enabling the policy, you can add claims inside the policy. Here is a sample:
```
    <AssignVariable>
        <Name>claims</Name>
        <Value>{"claim1": "abc", "claim2": "efg"}</Value>
    </AssignVariable>
```
The claims must be set as a JSON (stringifyed) in the claims variable. 

#### How can I get refresh tokens?
The OAuth v2 policy supports password grant. If a request is sent as below:
```
POST /token
{
  "client_id":"foo",
  "client_secret":"foo",
  "grant_type":"password",
  "username":"blah",
  "password": "blah"
}
```
If valid, the response will contain a refresh token.

#### How do I refresh an access_token?
Send a request as below:
```
POST /refresh
{
	"grant_type": "refresh_token",
	"refresh_token": "foo",
	"client_id":"blah",
        "client_secret":"blah"
}
```
If valid, the response will contain a new access_token.

#### What grant types are supported?
client_credentials, password and refresh_token
Users can extend the Apigee OAuth v2 policy to add support for the remaining grant types.

#### Support for JSON Web Keys
Microgateway stores private keys and public keys in an encrypted kvm. The proxy exposes an endpoint '/jwkPublicKeys' to return public keys as JWK.
* Support for "kid" - Key Identifiers. If the KVM includes a field called 'private_key_kid' (value can be any string), the JWT header will include the "kid"
```
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "1"
}

* The "kid" can be leveraged during validation of the JWT (not yet implemented in microgateway)
```
