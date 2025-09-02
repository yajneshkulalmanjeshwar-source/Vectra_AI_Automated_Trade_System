const getHistoryData= require('./node_get_historyData')
const fs = require('fs');
async function generateTrainData(smart_api,exchange,stockToken,period,Callback) {

    let currentDate=new Date();
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
    const indianDate = currentDate.toLocaleString('en-IN', options);
    DATE=parseInt(indianDate.split('/')[0])
    MONTH=parseInt(indianDate.split('/')[1])
    YEAR=parseInt(indianDate.split('/')[2])

    loopDate=new Date();
    loopDate.setFullYear(loopDate.getFullYear()-1,0,1)
    
    const monthsWith31Days = [0,2,4,6,7,9,11];
    DATA=[]

    while(loopDate.getTime()<currentDate.getTime())
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
            let retData31=await getHistoryData(smart_api,exchange,stockToken,period,loopDate.getFullYear()+'-'+Lmonth+'-31 09:00',loopDate.getFullYear()+'-'+Lmonth+'-31 15:30')
            if(retData31.length>0) DATA=DATA.concat(retData31)
        }
        loopDate.setMonth(loopDate.getMonth()+1)
    }
    Callback(DATA,stockToken)





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