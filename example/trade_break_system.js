let { SmartAPI, WebSocketClient, WebSocketV2, WSOrderUpdates } = require('../../../lib');
const get_OHLC_Data = require('../../get_OHCL_data.js');
const Credentials=require('../../../config/credentials.js')
const express =require('express');
const axios =require("axios");
const cors =require("cors");
const zlib = require('zlib');
const fs = require('fs');
// const orderIndex=require('./order-functions/order-index.js')

const app = express();
app.use(express.json());
app.use(cors());

let loadingIMG=['-','\\','|','/']
let loadingIMGCount=0;
const dayRequired=5 // 90 days of OHLC data

let smart_api = new SmartAPI();
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let web_socket;
let fetchData;
let presentPrice;
let interval_1;
let interval_2;
let exitFlag=false;
let BBands;

const cliProgress = require('cli-progress');

// create a new progress bar instance
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

// start the progress bar with a total value of 100
bar.start(30, 0);


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async ()=>
{
    const rlPromise = () => new Promise((resolve) => rl.question('Enter TOTP? ', resolve));
    let TOTP= await rlPromise();
    let sessionData= await smart_api.generateSession(TOTP);
    console.log('[INFO] Session generated..');
    let position

    setInterval(async () =>
        { 
            position= await getPosition(smart_api);
            if(position)
            {
                //process.stdout.write("Live Position Break "+((parseFloat(position.pnl)*100)/parseFloat(position.buyamount)).toFixed(2)+'% '+loadingIMG[loadingIMGCount%4]+'\r');
                loadingIMGCount+=1;
                bar.update(parseFloat(((parseFloat(position.pnl)*100)/parseFloat(position.buyamount)).toFixed(2)));
                //if(((parseFloat(position.pnl)*100)/parseFloat(position.buyamount))>=30)
				if(parseFloat(position.pnl)>=3000)
                {
                    exitPosition(smart_api,position)
                    bar.stop();
                    console.log('[SUCCESS] stock hit 3000....');
                }

           }
        },50);
})

async function getPosition(smart_api) {
    try {
        const response = await smart_api.getPosition();
        if (response.data) {
			let rawPosition=response.data;
			if(rawPosition) 
			{
                //console.log(rawPosition)
				for(let i=0;i<rawPosition.length;i++)
				{
					let position=rawPosition[i]
                    
					if(parseInt(position.netqty)!=0)
						{
							return {
								tradingsymbol: position.tradingsymbol,
								symbolname:position.symbolname,
								symboltoken:position.symboltoken,
								exchange: position.exchange,
								totalqty: Math.abs(parseInt(position.buyqty)),
								buyamount: parseInt(position.buyamount),
								pnl: parseInt(position.pnl)
	
							}
						}
				}
			
				
			}
			
            return undefined;
				      
        }
    } catch (error) {
        console.error("Error fetching positions:", error);
    }
}


async function exitPosition(smart_api , position) {
   
	
    try {
		if(position){
        let responseResult=await smart_api.placeOrder({
			variety: "NORMAL",
            tradingsymbol: position.tradingsymbol,
			symboltoken:position.symboltoken,
            transactiontype:"SELL",
            exchange: "NFO",
            quantity: position.totalqty, // Adjusting for lot size
			ordertype: "MARKET",
            producttype:"INTRADAY",
			duration: "DAY"
        });
		console.log(responseResult)
		if(responseResult.status)
        {
            exitFlag=false;
            console.log(`[SUCCESS] Exit order placed for ${position.tradingsymbol}`);
        }
		   
		else
        {
			console.log('[ERROR] Exit order cannot be placed..');
           
        }
		return true;
	}
    
    } catch (error) {
        console.error(`Error executing exit order for ${position.tradingsymbol}:`, error);
        
    }
}





















































// let { SmartAPI, WebSocketClient, WebSocketV2, WSOrderUpdates } = require('../lib');
// const sendTrainData=require('../vectra_node_lib/sendTrainData')
// const sendValidateData=require('../vectra_node_lib/sendValidateData')
// const generateTrainData=require('../vectra_node_lib/generateTrainData')
// const nodePyPredictSocket=require('../vectra_node_lib/node_pyPredict_websocket')
// const appendJSON=require('../vectra_node_lib/storeDataset')
// const dataServive=require('../vectra_node_lib/storeDataset')
// const fs = require('fs').promises;
// let smart_api = new SmartAPI();
// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
// let preSecData={};

// (async ()=>
// {
// 	const rlPromise= ()=>{ return new Promise((resolve)=> rl.question('Enter totp?',resolve)) }
// 	try
// 	{
// 		let TOTP= await rlPromise();
// 		let sessionData= await smart_api.generateSession(TOTP);
// 		console.log('[INFO] Session generated..')
// 		let stockToken='19585'
// 		//19585
// 		//324
// 		//nodePyPredictSocket(smart_api,stockToken)

// 		//sendTrainData(smart_api,stockToken)
// 		//sendValidateData(smart_api,stockToken)
		
		
// 		//console.log(await getHistoryData(smart_api,'NSE','31181','ONE_MINUTE','2024-12-01 09:00','2024-12-30 15:30'))
		

// 		//search Scrip Methods
// 		// smart_api.searchScrip({
// 		// 			"exchange": "NFO", 
// 		// 			"searchscrip":"BANKNIFTY24APR2555400PE"
// 		// 		}).then((data)=>{
// 		// 			console.log('data:',data);
// 		// 		})

// 	// return smart_api.optionGreek({
// 	// 	"name":"NIFTY", // Here Name represents the Underlying stock
// 	// 	"expirydate":"30APR2025"
// 	// }).then(data => {
// 	// 	console.log(data)
// 	// });

// 		//****************************GET HISTORY DATA FOR TRAIN MODEL START****************************/
// 		// let stockData= await smart_api.getCandleData({
// 		// 	"exchange": "NSE",
// 		// 	"symboltoken": stockToken,
// 		// 	"interval": "ONE_MINUTE",
// 		// 	"fromdate": "2024-12-09 09:00",
// 		// 	"todate": "2024-12-09 15:30"
// 		// });
		
// 		// console.log(stockData)
// 		// let resData={
// 		// 	name:"3045",
// 		// 	data:stockData.data
// 		// }
// 		// nodePyTrainSocket(resData,(data)=>
// 		// {
// 		// 	console.log(data)
// 		// })
// 		//****************************GET HISTORY DATA FOR TRAIN MODEL END****************************/


		




// 		// ****************************** GET LIVE MARKET DATA START************************************** */
// 		// Market Data Methods
		
// 		// smart_api.marketData({
//  		// 			"mode": "FULL",
//  		// 			"exchangeTokens": {
//  		// 				"NSE": [
// 		// 					['80708']//stockToken
//  		// 				]
//  		// 			}
// 		// 		}).then((data) => {
// 		// 			console.log(JSON.stringify(data, null, 2));
// 		// 	        //  console.log(JSON.stringify(data))
//    		// 		});


			
// 			let web_socket = new WebSocketV2({
// 				jwttoken: sessionData.data.jwtToken,
// 				apikey: 'ZoMGfNCi',
// 				clientcode: 'Y60234689',
// 				feedtype: sessionData.data.feedToken,
// 				stockToken:'51962'
// 			});

// 			//For handling custom error 
// 			web_socket.customError();

// 			// handle reconnection
// 			web_socket.reconnection('simple', 1000, 6);

// 			try{
// 			web_socket.connect().then(() => {
// 				let json_req = {
// 					correlationID: "abcde12345",
// 					action: 1,
// 					mode: 3,
// 					exchangeType: 2,
// 					tokens: ['51962']//[stockToken],
// 				};

// 				web_socket.fetchData(json_req);

// 				web_socket.on("tick", (data)=> {
// 					if(data!='pong')
// 						{
							
// 							if(preSecData?.exchange_timestamp && getDateString(preSecData.exchange_timestamp)!=getDateString(data.exchange_timestamp))
// 									{
// 										process.stdout.write(`${data.open_interest}\r`)
// 										//console.log(preSecData)
// 										// if(getMinuteCheck(preSecData.exchange_timestamp))
// 										// 	console.log('5min check')
// 									}
// 									preSecData=data;
							        
// 						} 

// 				})

				
				
// 			})
// 		}
// 		catch(error)
// 		{
// 			console.log('[ERROR] error while fetching the data')
// 		}
		
// 		// 	//****************************** GET LIVE MARKET DATA END************************************** */
	
	
	
	
	
	
	
	
	
	
	
	
	
// 	}
// 	catch (error) {
//         console.error('Error:', error.message);
//     }
// })()




// function getDateString(date)
// {
// 	const dateObj=new Date(Number(date))
// 	const formattedDate = `${dateObj.getSeconds().toString().padStart(2, '0')}.${dateObj.getMilliseconds()}`;
//     return formattedDate
// }
// function getMinuteCheck(date)
// {
// 	const minute=5; //5 min check
// 	const dateObj=new Date(Number(date))
// 	return dateObj.getMinutes()%minute==0?true:false
    
// }






















		//console.log(data);
// 		return smart_api.getProfile();

// 		// 	// User Methods
// 		// 	// return smart_api.logout()

// 		// 	// return smart_api.getRMS();

// 		// 	// Order Methods
// 		// 	// return smart_api.placeOrder({
// 		// 	//     "variety": "NORMAL",
// 		// 	//     "tradingsymbol": "SBIN-EQ",
// 		// 	//     "symboltoken": "3045",
// 		// 	//     "transactiontype": "BUY",
// 		// 	//     "exchange": "NSE",
// 		// 	//     "ordertype": "LIMIT",
// 		// 	//     "producttype": "INTRADAY",
// 		// 	//     "duration": "DAY",
// 		// 	//     "price": "19500",
// 		// 	//     "squareoff": "0",
// 		// 	//     "stoploss": "0",
// 		// 	//     "quantity": "1"
// 		// 	// })

// 		// 	// return smart_api.modifyOrder({
// 		// 	//     "orderid": "201130000006424",
// 		// 	//     "variety": "NORMAL",
// 		// 	//     "tradingsymbol": "SBIN-EQ",
// 		// 	//     "symboltoken": "3045",
// 		// 	//     "transactiontype": "BUY",
// 		// 	//     "exchange": "NSE",
// 		// 	//     "ordertype": "LIMIT",
// 		// 	//     "producttype": "INTRADAY",
// 		// 	//     "duration": "DAY",
// 		// 	//     "price": "19500",
// 		// 	//     "squareoff": "0",
// 		// 	//     "stoploss": "0",
// 		// 	//     "quantity": "1"
// 		// 	// });

// 		// 	// return smart_api.cancelOrder({
// 		// 	//     "variety": "NORMAL",
// 		// 	//     "orderid": "201130000006424"
// 		// 	// });

// 		// 	// return smart_api.getOrderBook();

				// smart_api.getOrderBook().then((data)=>{
				// 	console.log(data);
				// })

// 		// 	// return smart_api.getTradeBook();

// 		// 	// Portfolio Methods
// 		// 	// return smart_api.getHolding();

// 		// 	// return smart_api.getPosition();

// 		// 	// return smart_api.convertPosition({
// 		// 	//     "exchange": "NSE",
// 		// 	//     "oldproducttype": "DELIVERY",
// 		// 	//     "newproducttype": "MARGIN",
// 		// 	//     "tradingsymbol": "SBIN-EQ",
// 		// 	//     "transactiontype": "BUY",
// 		// 	//     "quantity": 1,
// 		// 	//     "type": "DAY"
// 		// 	// });

// 		// 	// GTT Methods
// 		// 	// return smart_api.createRule({
// 		// 	//    "tradingsymbol" : "SBIN-EQ",
// 		// 	//    "symboltoken" : "3045",
// 		// 	//    "exchange" : "NSE",
// 		// 	//    "producttype" : "MARGIN",
// 		// 	//    "transactiontype" : "BUY",
// 		// 	//    "price" : 100000,
// 		// 	//    "qty" : 10,
// 		// 	//    "disclosedqty": 10,
// 		// 	//    "triggerprice" : 200000,
// 		// 	//    "timeperiod" : 365
// 		// 	// })
// 		// 	// return smart_api.modifyRule({
// 		// 	//             "id" : 1000014,
// 		// 	//             "symboltoken" : "3045",
// 		// 	//             "exchange" : "NSE",
// 		// 	//             "qty" : 10

// 		// 	// })
// 		// 	// return smart_api.cancelRule({
// 		// 	//      "id" : 1000014,
// 		// 	//      "symboltoken" : "3045",
// 		// 	//      "exchange" : "NSE"
// 		// 	// })
// 		// 	// return smart_api.ruleDetails({
// 		// 	//     "id" : 25
// 		// 	// })
// 		// 	// return smart_api.ruleList({
// 		// 	//      "status" : ["NEW","CANCELLED"],
// 		// 	//      "page" : 1,
// 		// 	//      "count" : 10
// 		// 	// })

// 		// 	// Historical Methods
			


		

		

		// get all holding method
		// smart_api.getAllHolding().then((data)=>{
		// 	console.log(data);
		// })

    // get individual order details
    // smart_api.indOrderDetails("GuiOrderID").then((data) => {
    //   console.log(data);
    // });

	// // margin api Method
	// smart_api
    // .marginApi({
    //   positions: [
    //     {
    //       exchange: "NFO",
    //       qty: 1500,
    //       price: 0,
    //       productType: "CARRYFORWARD",
    //       token: "154388",
    //       tradeType: "SELL",
    //     }
    //   ],
    // })
    // .then((data) => {
    //   console.log(data);
    // });

	//brokerage calculator
	// return smart_api.estimateCharges({
	// 	"orders": [
	// 		{
	// 			"product_type": "DELIVERY",
	// 			"transaction_type": "BUY",
	// 			"quantity": "10",
	// 			"price": "800",
	// 			"exchange": "NSE",
	// 			"symbol_name": "745AS33",
	// 			"token": "17117"
	// 		}, {
	// 			"product_type": "DELIVERY",
	// 			"transaction_type": "BUY",
	// 			"quantity": "10",
	// 			"price": "800",
	// 			"exchange": "BSE",
	// 			"symbol_name": "PIICL151223",
	// 			"token": "726131"
	// 		}
	// 	]
	// }).then(data=>{
	// 	console.log(data)
	// });

	//verifydis
	// return smart_api.verifyDis({
	// 	"isin":"INE528G01035",
	// 	"quantity":"1"
	// }).then(data => {
	// 	console.log(data)
	// });

	// return smart_api.generateTPIN({
	// 	"dpId":"33200",
	// 	"ReqId":"2351614738654050",
	// 	"boid":"1203320018563571",
	// 	"pan":"JZTPS2255C"
	// }).then(data => {
	// 	console.log(data)
	// });
	//getTransactionStatus
	// return smart_api.getTranStatus({
	// 	"ReqId":"2351614738654050"
	// }).then(data => {
	// 	console.log(data)
	// });

	// return smart_api.optionGreek({
	// 	"name":"TCS", // Here Name represents the Underlying stock
	// 	"expirydate":"25JAN2024"
	// }).then(data => {
	// 	console.log(data)
	// });
	
	// return smart_api.gainersLosers({
	// 	"datatype":"PercOIGainers", // Type of Data you want(PercOILosers/PercOIGainers/PercPriceGainers/PercPriceLosers)
	// 	"expirytype":"NEAR" // Expiry Type (NEAR/NEXT/FAR)
	// }).then(data => {
	// 	console.log(data)
	// });

	// return smart_api.putCallRatio().then(data => {
	// 	console.log(data)
	// });
	
	// return smart_api.oIBuildup({
	// 	"expirytype":"NEAR",
	// 	"datatype":"Long Built Up"
	// }).then(data => {
	// 	console.log(data)
	// });																																															


// })
// .then((data) => {
// 	console.log('PROFILE::', data);
// })
// .catch((ex) => {
// 	console.log('EX::', ex);
// });

// // // smart_api.generateToken("YOUR_REFRESH_TOKEN")
// // //     .then((data) => {
// // //         console.log(data)
// // //     });

// smart_api.setSessionExpiryHook(customSessionHook);

// function customSessionHook() {
//     // USER CAN GENERATE NEW JWT HERE
//     console.log("User loggedout");
// }

// ########################### Socket Sample Code Starts Here ###########################
// Old Websocket

// let web_socket = new WebSocket({
//     client_code: "CLIENT_CODE",
//     feed_token: "FEED_TOKEN"
// });

// web_socket.connect()
//     .then(() => {
//         web_socket.runScript("SCRIPT", "TASK") // SCRIPT: nse_cm|2885, mcx_fo|222900  TASK: mw|sfi|dp

//         setTimeout(function () {
//             web_socket.close()
//         }, 3000)
//     })

// web_socket.on('tick', receiveTick)

// function receiveTick(data) {
//     console.log("receiveTick:::::", data)
// }

// ########################### Socket Sample Code Ends Here ###########################

// ########################### Socket Sample Code Starts Here ###########################
// New websocket

// let web_socket = new WebSocketClient({
//     clientcode: "CLIENT_CODE",
//     jwttoken: 'JWT_TOKEN',
//     apikey: "API_KEY",
//     feedtype: "FEED_TYPE",
// });

// web_socket.connect()
//     .then(() => {
//         web_socket.fetchData("subscribe", "order_feed");  // ACTION_TYPE: subscribe | unsubscribe FEED_TYPE: order_feed

//         setTimeout(function () {
//             web_socket.close()
//         }, 60000)
//     });

// web_socket.on('tick', receiveTick);

// function receiveTick(data) {
//     console.log("receiveTick:::::", data);
// }

// ########################### Socket V2 Sample Code Start Here ###########################
// let web_socket = new WebSocketV2({
// 	jwttoken: 'JWT_TOKEN',
// 	apikey: 'API_KEY',
// 	clientcode: 'Client_code',
// 	feedtype: 'FEED_TYPE',
// });

// //For handling custom error 
// web_socket.customError();

// // handle reconnection
// web_socket.reconnection(reconnectType, delayTime, multiplier);

// web_socket.connect().then(() => {
// 	let json_req = {
// 		correlationID: "abcde12345",
// 		action: 1,
// 		mode: 2,
// 		exchangeType: 1,
// 		tokens: ["1594"],
// 	};

// 	web_socket.fetchData(json_req);

// 	web_socket.on("tick", receiveTick);

// 	function receiveTick(data) {
// 		console.log("receiveTick:::::", data);
// 	}

// 	// setTimeout(() => {
// 	// 	web_socket.close();
// 	// }, 2000);
	
// }).catch((err) => {
// 	console.log('Custom error :', err.message);
// });
// ########################### Socket V2 Sample Code End Here ###########################

// ########################### Socket Client updates Sample Code Start Here ###########################
// let ws_clientupdate = new WSOrderUpdates({
//   jwttoken: 'JWT_TOKEN',
// 	 apikey: 'API_KEY',
// 	 clientcode: 'Client_code',
// 	 feedtype: 'FEED_TYPE',
// });

// ws_clientupdate.connect().then(() => {

// 	ws_clientupdate.on("tick", receiveTick);

// 	function receiveTick(data) {
// 		console.log("receiveTick:::::", data);
// 	}

// 	// setTimeout(() => {
// 	// 	ws_clientupdate.close();
// 	// }, 10000);
	

// ########################### Socket Client updates Sample Code End Here ###########################