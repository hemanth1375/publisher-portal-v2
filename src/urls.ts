const host="http://10.175.1.72:8082"
export const urls={
    saveEndpoint:host+"/krakend/saveKrakendJson",
    addEndpoint:host+"/krakend/addendpoints",
    updateEndpoint:host+"/krakend/updateEndpoint",
    getEndpointById:host+"/krakend/getKrakendJson",
    updateBackend:host+"/krakend/updateBackendOfEndpoint",
    updateKrakend:host+"/krakend/updateKrakendJson",
    getJsonCards:host+"/krakend/getKrakendJsonCards",
    getUser:host+"/user/getUser",
    deployFile:host+"/krakend/krakendFile",
    getEndpointCards:host+"/krakend/endpoint/getEndpointCards"
}