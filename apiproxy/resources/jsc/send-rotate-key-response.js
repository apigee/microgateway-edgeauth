 //send response
 var message = context.getVariable('responseMessage') || 'Key Rotation successfully completed!'; 
 context.setVariable("response.header.Content-Type","text/plain");
 context.setVariable("response.header.Cache-Control","no-store");
 context.setVariable("response.content", message);
 context.setVariable("response.status.code", 200); 