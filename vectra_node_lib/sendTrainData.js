const generateTrainData=require('./generateTrainData')
const nodePyTrainSocket=require('./node_pyTrain_websocket')
function sendTrainData(smart_api,stockToken)
{
    generateTrainData(smart_api,'NSE',stockToken,'FIVE_MINUTE',nodePyTrainSocket)  
}

module.exports=sendTrainData