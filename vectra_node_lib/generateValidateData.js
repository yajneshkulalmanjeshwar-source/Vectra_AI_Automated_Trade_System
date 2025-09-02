const getHistoryData= require('./node_get_historyData')
const fs = require('fs');
async function generateTrainData(smart_api,exchange,stockToken,period,Callback) {

    let currentDate=new Date();
    let loopEndDate=new Date();
    

    let loopDate=new Date();
    loopDate.setFullYear(loopDate.getFullYear()-1,0,1)

    
    loopEndDate.setFullYear(loopEndDate.getFullYear(),loopEndDate.getMonth()-1,15)

    const monthsWith31Days = [0,2,4,6,7,9,11];
    DATA=[]
    VALIDATA=[]

    while(loopDate.getTime()<loopEndDate.getTime())
    {
       

        let day31Flag=false;
        if(monthsWith31Days.includes(loopDate.getMonth()))
        {
            day31Flag=true;
        }
        let Lmonth=loopDate.getMonth()+1<10?'0'+(loopDate.getMonth()+1).toString():(loopDate.getMonth()+1).toString();

        
        console.log('[INFO] fetch data for '+loopDate.getFullYear()+'-'+Lmonth+'-01 09:00',loopDate.getFullYear()+'-'+Lmonth+'-30 15:30'+' ..........')
        let retData30=await getHistoryData(smart_api,exchange,stockToken,period,loopDate.getFullYear()+'-'+Lmonth+'-01 09:00',loopDate.getFullYear()+'-'+Lmonth+'-30 15:30')
        if(retData30.length>0) DATA=DATA.concat(retData30);
        if(day31Flag)
        {
            console.log('[INFO] fetch data for '+loopDate.getFullYear()+'-'+Lmonth+'-31 09:00',loopDate.getFullYear()+'-'+Lmonth+'-31 15:30'+' ..........')
            let retData31=await getHistoryData(smart_api,exchange,stockToken,period,loopDate.getFullYear()+'-'+Lmonth+'-31 09:00',loopDate.getFullYear()+'-'+Lmonth+'-31 15:30')
            if(retData31.length>0) DATA=DATA.concat(retData31)
        }
        loopDate.setMonth(loopDate.getMonth()+1)
    }
        
        if(currentDate.getDay()==5)
        {
            currentDate.setHours(currentDate.getHours()-48);
            let options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
            let indianDate = currentDate.toLocaleString('en-IN', options);
            DATE=parseInt(indianDate.split('/')[0])
            MONTH=parseInt(indianDate.split('/')[1])
            YEAR=parseInt(indianDate.split('/')[2])

            console.log('[INFO] fetch data for '+YEAR+'-'+MONTH+'-01 09:00',YEAR+'-'+MONTH+'-'+DATE+' 15:30'+' ..........')
            let getLastMonthdata=await getHistoryData(smart_api,exchange,stockToken,period,YEAR+'-'+MONTH+'-01 09:00',YEAR+'-'+MONTH+'-'+DATE+' 15:30')
            if(getLastMonthdata.length>0) DATA=DATA.concat(getLastMonthdata)

            console.log('************************ START VALIDATION ******************************')
            console.log('[INFO] fetch data for '+YEAR+'-'+MONTH+'-'+DATE+' 13:52',YEAR+'-'+MONTH+'-'+DATE+' 15:30'+' ..........')
            let getDayMonthdata=await getHistoryData(smart_api,exchange,stockToken,period,YEAR+'-'+MONTH+'-'+DATE+' 13:52',YEAR+'-'+MONTH+'-'+DATE+' 15:30')
            if(getDayMonthdata.length>0) VALIDATA=VALIDATA.concat(getDayMonthdata)
            
            
            currentDate.setHours(currentDate.getHours()+24);
            options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
            indianDate = currentDate.toLocaleString('en-IN', options);
            DATE=parseInt(indianDate.split('/')[0])
            MONTH=parseInt(indianDate.split('/')[1])
            YEAR=parseInt(indianDate.split('/')[2])


            console.log('[INFO] fetch data for '+YEAR+'-'+MONTH+'-'+DATE+' 09:00',YEAR+'-'+MONTH+'-'+DATE+' 15:30'+' ..........')
            getDayMonthdata=await getHistoryData(smart_api,exchange,stockToken,period,YEAR+'-'+MONTH+'-'+DATE+' 09:00',YEAR+'-'+MONTH+'-'+DATE+' 15:30')
            if(getDayMonthdata.length>0) VALIDATA=VALIDATA.concat(getDayMonthdata)
            
   
        }
        else if(currentDate.getDay()==6)
            {
                currentDate.setHours(currentDate.getHours()-72);
                let options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
                let indianDate = currentDate.toLocaleString('en-IN', options);
                DATE=parseInt(indianDate.split('/')[0])
                MONTH=parseInt(indianDate.split('/')[1])
                YEAR=parseInt(indianDate.split('/')[2])
    
                console.log('[INFO] fetch data for '+YEAR+'-'+MONTH+'-01 09:00',YEAR+'-'+MONTH+'-'+DATE+' 15:30'+' ..........')
                let getLastMonthdata=await getHistoryData(smart_api,exchange,stockToken,period,YEAR+'-'+MONTH+'-01 09:00',YEAR+'-'+MONTH+'-'+DATE+' 15:30')
                if(getLastMonthdata.length>0) DATA=DATA.concat(getLastMonthdata)
    
                console.log('************************ START VALIDATION ******************************')
                console.log('[INFO] fetch data for '+YEAR+'-'+MONTH+'-'+DATE+' 13:52',YEAR+'-'+MONTH+'-'+DATE+' 15:30'+' ..........')
                let getDayMonthdata=await getHistoryData(smart_api,exchange,stockToken,period,YEAR+'-'+MONTH+'-'+DATE+' 13:52',YEAR+'-'+MONTH+'-'+DATE+' 15:30')
                if(getDayMonthdata.length>0) VALIDATA=VALIDATA.concat(getDayMonthdata)
                
                
                currentDate.setHours(currentDate.getHours()+24);
                options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
                indianDate = currentDate.toLocaleString('en-IN', options);
                DATE=parseInt(indianDate.split('/')[0])
                MONTH=parseInt(indianDate.split('/')[1])
                YEAR=parseInt(indianDate.split('/')[2])
    
    
                console.log('[INFO] fetch data for '+YEAR+'-'+MONTH+'-'+DATE+' 09:00',YEAR+'-'+MONTH+'-'+DATE+' 15:30'+' ..........')
                getDayMonthdata=await getHistoryData(smart_api,exchange,stockToken,period,YEAR+'-'+MONTH+'-'+DATE+' 09:00',YEAR+'-'+MONTH+'-'+DATE+' 15:30')
                if(getDayMonthdata.length>0) VALIDATA=VALIDATA.concat(getDayMonthdata)
                
       
            }
            else{

                currentDate.setHours(currentDate.getHours()-24);
                let options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
                let indianDate = currentDate.toLocaleString('en-IN', options);
                DATE=parseInt(indianDate.split('/')[0])
                MONTH=parseInt(indianDate.split('/')[1])
                YEAR=parseInt(indianDate.split('/')[2])
    
                console.log('[INFO] fetch data for '+YEAR+'-'+MONTH+'-01 09:00',YEAR+'-'+MONTH+'-'+DATE+' 15:30'+' ..........')
                let getLastMonthdata=await getHistoryData(smart_api,exchange,stockToken,period,YEAR+'-'+MONTH+'-01 09:00',YEAR+'-'+MONTH+'-'+DATE+' 15:30')
                if(getLastMonthdata.length>0) DATA=DATA.concat(getLastMonthdata)
    
                console.log('************************ START VALIDATION ******************************')
                console.log('[INFO] fetch data for '+YEAR+'-'+MONTH+'-'+DATE+' 13:52',YEAR+'-'+MONTH+'-'+DATE+' 15:30'+' ..........')
                let getDayMonthdata=await getHistoryData(smart_api,exchange,stockToken,period,YEAR+'-'+MONTH+'-'+DATE+' 13:52',YEAR+'-'+MONTH+'-'+DATE+' 15:30')
                if(getDayMonthdata.length>0) VALIDATA=VALIDATA.concat(getDayMonthdata)
                
                
                currentDate.setHours(currentDate.getHours()+24);
                options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
                indianDate = currentDate.toLocaleString('en-IN', options);
                DATE=parseInt(indianDate.split('/')[0])
                MONTH=parseInt(indianDate.split('/')[1])
                YEAR=parseInt(indianDate.split('/')[2])
    
    
                console.log('[INFO] fetch data for '+YEAR+'-'+MONTH+'-'+DATE+' 09:00',YEAR+'-'+MONTH+'-'+DATE+' 15:30'+' ..........')
                getDayMonthdata=await getHistoryData(smart_api,exchange,stockToken,period,YEAR+'-'+MONTH+'-'+DATE+' 09:00',YEAR+'-'+MONTH+'-'+DATE+' 15:30')
                if(getDayMonthdata.length>0) VALIDATA=VALIDATA.concat(getDayMonthdata)
            }
    console.log(DATA.length,VALIDATA.length)
    Callback(DATA,VALIDATA,stockToken)





    // const csvContent = DATA.map(row => row.join(",")).join("\n");

    // console.log(DATA)

    // fs.writeFile('../datasets/trainsets/train_data_31181.csv', csvContent, (err) => {
    //     if (err) {
    //       console.error("Error writing to file:", err);
    //     } else {
    //       console.log("CSV file saved successfully!");
    //     }
    //   });




    
}

module.exports=generateTrainData;








// while(loopDate.getTime()<currentDate.getTime())
//     {
//         let day31Flag=false;
//         if(monthsWith31Days.includes(loopDate.getMonth()))
//         {
//             day31Flag=true;
//         }
//         let Lmonth=loopDate.getMonth()+1<10?'0'+(loopDate.getMonth()+1).toString():(loopDate.getMonth()+1).toString();
        
//         console.log('[INFO] fetch data for '+loopDate.getFullYear()+'-'+Lmonth+'-01 09:00',loopDate.getFullYear()+'-'+Lmonth+'-30 15:30'+' ..........')
//         let retData30=await getHistoryData(smart_api,exchange,stockToken,period,loopDate.getFullYear()+'-'+Lmonth+'-01 09:00',loopDate.getFullYear()+'-'+Lmonth+'-30 15:30')
//         if(retData30.length>0) DATA=DATA.concat(retData30);
//         if(day31Flag)
//         {
//             let retData31=await getHistoryData(smart_api,exchange,stockToken,period,loopDate.getFullYear()+'-'+Lmonth+'-31 09:00',loopDate.getFullYear()+'-'+Lmonth+'-31 15:30')
//             if(retData31.length>0) DATA=DATA.concat(retData31)
//         }
//         loopDate.setMonth(loopDate.getMonth()+1)
//     }
//     Callback(DATA,stockToken)