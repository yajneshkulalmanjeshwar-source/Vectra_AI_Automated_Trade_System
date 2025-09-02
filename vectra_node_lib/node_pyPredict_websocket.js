const websocket= require('ws');
const getHistoryData= require('./node_get_historyData')



function getDelayToNextMinuteIST() {
    const now = new Date();
    
    // Convert to IST (UTC+5:30)
    const istNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    
    // Calculate milliseconds remaining to the next minute
    const seconds = istNow.getSeconds();
    const milliseconds = istNow.getMilliseconds();
    return (60 - seconds) * 1000 - milliseconds;
  }

async function getTodayData(smart_api,stockToken) {
        currentDate=new Date();
        const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
        const indianDate = currentDate.toLocaleString('en-IN', options);
        DATE=indianDate.split('/')[0]
        MONTH=indianDate.split('/')[1]
        YEAR=indianDate.split('/')[2]
        const startDate=YEAR+'-'+MONTH+'-'+DATE+' 09:00';
        const toDate=YEAR+'-'+MONTH+'-'+DATE+' 15:30';
        const period='ONE_MINUTE';
        console.log(startDate)
        return await getHistoryData(smart_api,'NSE',stockToken,period,startDate,toDate)
        
    
}
var nodePyPredictSocket= function (smart_api,stockToken)
{
const ws = new websocket('ws://localhost:8766');
ws.on('open', () => {
    console.log('[INFO] Connected to Python WebSocket Server for Predict stock..');
    const delay = getDelayToNextMinuteIST();
    
    


    setTimeout(async () => {
        
        
        sendData=
        {
            stockToken:stockToken,
            data:await getTodayData(smart_api,stockToken)
        }
        console.log('[INFO] Sending stock prediction request for ',stockToken)
        ws.send(JSON.stringify(sendData));
        setInterval(async ()=>
            {
                sendData=
                {
                    stockToken:stockToken,
                    data:await getTodayData(smart_api,stockToken)
                }
                console.log('[INFO] Sending stock prediction request for ',stockToken)
                ws.send(JSON.stringify(sendData));
            }, 60 * 1000); // Subsequent requests every minute
      }, delay);

    

});

ws.on('message', (message) => {
   
    const response = JSON.parse(message);
    console.log('[INFO] Predicted value ',response.price);
    //ws.close();
    //Callback(message.price)
});
ws.on('close', () => {
    console.log('[INFO] predict connection closed');
});

ws.on('error', (error) => {
    console.error('Error:', error);
});
}

module.exports=nodePyPredictSocket;