var debugMpId = context.getVariable("debug.mp.id");
if(debugMpId) {
        context.setVariable("debugMpId", ",\n\"debugMpId\" : \""+ context.getVariable("system.uuid")+ "\"");
}
