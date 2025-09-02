const getHistoryData= require('./node_get_historyData')
async function generateTrainData(smart_api) {
    currentDate=new Date();
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
    const indianDate = currentDate.toLocaleString('en-IN', options);
    DATE=parseInt(indianDate.split('/')[0])
    MONTH=parseInt(indianDate.split('/')[1])
    YEAR=parseInt(indianDate.split('/')[2])

    loopDate=new Date();
    loopDate.setFullYear(loopDate.getFullYear()-1,0,1)
    console.log(loopDate.getDay(),loopDate.getMonth(),loopDate.getFullYear())
    console.log(currentDate.getDay(),currentDate.getMonth(),currentDate.getFullYear())
    const monthsWith31Days = [0,2,4,6,7,9,11];
    DATA=[]

    while(loopDate.getTime()<currentDate.getTime())
    {
        let day31=false;
        if(monthsWith31Days.includes(loopDate.getMonth()))
        {
            day31=true;
        }
        let Lmonth=loopDate.getMonth()+1<10?'0'+(loopDate.getMonth()+1).toString():(loopDate.getMonth()+1).toString();
        
        DATA=DATA.concat(getHistoryData(smart_api,'NSE','31181','ONE_MINUTE',loopDate.getFullYear()+'-'+Lmonth+'-01 09:00',loopDate.getFullYear()+'-'+Lmonth+'-30 15:30'));
        if(day31)
        {
            DATA=DATA.concat(getHistoryData(smart_api,'NSE','31181','ONE_MINUTE',loopDate.getFullYear()+'-'+Lmonth+'-01 09:00',loopDate.getFullYear()+'-'+Lmonth+'-30 15:30'))
        }
        loopDate.setMonth(loopDate.getMonth()+1)
    }

    console.log(DATA)




    
}
generateTrainData()