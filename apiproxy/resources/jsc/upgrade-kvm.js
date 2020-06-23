var cert = context.getVariable("private.publicKey"); 
var privateKey = context.getVariable("private.privateKey"); 
var privateKeyKid = context.getVariable("private.private_key_kid"); 
var publicKey1Kid = context.getVariable("private.public_key1_kid"); 
var publicKey2Kid = context.getVariable("private.public_key2_kid");

validateKvm();

function validateKvm() {
    var publicKey1 = context.getVariable('public_key') || '';
    
    if(publicKey1 === null || publicKey1 === '') {
        context.setVariable('errText', 'public_key is required');
        return;
    }
    if(privateKey === null || privateKey === '') {
        context.setVariable('errText', 'KVM does not exist, Please run configure command');
        return;
    }
    if(cert === null || cert === '') {
        context.setVariable('errText', 'KVM does not exist, Please run configure command');
        return;
    }
    if(privateKeyKid === null || privateKeyKid === ''){
        context.setVariable('privateKeyKid', '1');
        context.setVariable('publicKey1Kid', '1');
    }else{
        context.setVariable('privateKeyKid', privateKeyKid);
        context.setVariable('publicKey1Kid', privateKeyKid);
    }
    if(publicKey1){
        context.setVariable('publicKey1', publicKey1);
    }
    if(publicKey1Kid && publicKey2Kid && publicKey1Kid === publicKey2Kid){
        context.setVariable('deletePublicKey2', true);
    }
}