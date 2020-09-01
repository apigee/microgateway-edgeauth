var futureKeysNbf = context.getVariable("private.future_keys_nbf"); 
var futurePrivateKey = context.getVariable("private.future_private_key"); 
var futurePrivateKeyKid = context.getVariable("private.future_private_key_kid"); 
var futureCertficate = context.getVariable("private.future_certficate"); 

var futurePublicKey1Kid = context.getVariable("private.future_public_key1_kid"); 
var futurePublicKey1 = context.getVariable("private.future_public_key1"); 
var futurePublicKey2Kid = context.getVariable("private.future_public_key2_kid"); 
var futurePublicKey2 = context.getVariable("private.future_public_key2"); 

if(futureKeysNbf && futureKeysNbf < Date.now()){
    var applyNewKey = true;
    
    if(futurePrivateKey && futurePrivateKey !== 'undefined'){
        context.setVariable('private.privateKey', futurePrivateKey);
    }
    if(futurePrivateKeyKid && futurePrivateKeyKid !== 'undefined'){
        context.setVariable('private.private_key_kid', futurePrivateKeyKid);
    }
    if(futureCertficate && futureCertficate !== 'undefined'){
        context.setVariable('private.publicKey', futureCertficate);
    }
    if(futurePublicKey1Kid && futurePublicKey1Kid !== 'undefined'){
        context.setVariable('private.public_key1_kid', futurePublicKey1Kid);
    }
    if(futurePublicKey1 && futurePublicKey1 !== 'undefined'){
        context.setVariable('private.public_key1', futurePublicKey1);
    }
    if(futurePublicKey2Kid && futurePublicKey2Kid !== 'undefined'){
        context.setVariable('private.public_key2_kid', futurePublicKey2Kid);
    }
    if(futurePublicKey2 && futurePublicKey2 !== 'undefined'){
        context.setVariable('private.public_key2', futurePublicKey2);
    }
    context.setVariable('applyNewKey', applyNewKey);
}