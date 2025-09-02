const fs = require('fs');
      
      
      
async function getHistoryData(smart_api,exchange,symboltoken,interval,fromdate,todate)
{
	//
   //****************************GET HISTORY DATA FOR PREDICT STOCK PRICE START****************************/
   const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
   let reTry=0;
   let stockData={data:''}
   do{
	if(stockData.data==undefined && reTry>4)
		break;
	else if(stockData.data==undefined)
	{
		console.log('[ERROR] retring connection with server for ',fromdate, todate,'.......')
		reTry++;
		await delay(1000);
	}
	
	stockData= await smart_api.getCandleData({
			"exchange": exchange,
			"symboltoken": symboltoken,
			"interval": interval,
			"fromdate": fromdate,
			"todate": todate
		})
	}while(stockData.data==undefined)
		reTry=0;
		
		if(stockData.data==undefined || stockData.data.length==0) 
			{
				console.log('[ERROR] empty data for ',fromdate, todate,'.......')
				
				return []				
			}
			else 
			{
				//console.log(stockData);
				console.log('[INFO] Recieved data for', fromdate, todate)
				return stockData.data;
			}
				
		  	 
}



module.exports=getHistoryData