const websocket= require('ws');
const zlib = require('zlib');


var nodePyTrainSocket= function (stockData,stockToken)
{
const ws = new websocket('ws://localhost:8765');
ws.on('open', () => {
    console.log('[INFO] Connected to Python WebSocket Server for train model');
    sendJSON={
        stockToken:stockToken,
        data:stockData
    }
    const jsonData=JSON.stringify(sendJSON);

    zlib.gzip(jsonData, (err, compressedData) => {
        if (err) {
            console.error('Error compressing data:', err);
            return;
        }

        // Send the compressed data to the client
        ws.send(compressedData);
    });
});

ws.on('message', (message) => {
   
    const response = JSON.parse(message);
    console.log('[INFO] Trained model for ',stockData.name);
    ws.close();
    //Callback(stockData.name)
});
ws.on('close', () => {
    console.log('[INFO] train connection closed');
});

ws.on('error', (error) => {
    console.error('Error:', error);
});
}

module.exports=nodePyTrainSocket;