const generateValidateData=require('./generateValidateData')
const nodePyValidateSocket=require('./node_pyValidate_websocket')
function sendValidateData(smart_api,stockToken)
{
    generateValidateData(smart_api,'NSE',stockToken,'ONE_MINUTE',nodePyValidateSocket)  
}

module.exports=sendValidateData