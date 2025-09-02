
const fs = require('fs');
const stockToken='5097';
const filePath='../example/Datasets/'+stockToken+'_data.json';
const fileData = fs.readFileSync(filePath, 'utf8');
let data=JSON.parse(fileData);
let preElem={};
let segData={}


// for(let i=0;i<data.length;i++)
// {
//     if(data[i].exchange_timestamp!=data[i+1].exchange_timestamp)
// }
data.forEach(element => {
    if(preElem['exchange_timestamp'] && getDateSecString(preElem.exchange_timestamp)!=getDateSecString(element.exchange_timestamp))
    {
        let indexString=getDateString(preElem.exchange_timestamp);
            segData[indexString]?segData[indexString].push(get(preElem.exchange_timestamp)):segData[indexString]=[get(preElem.exchange_timestamp)]
    }
    preElem=element;
   
});

for(let i in segData)
{
    console.log(segData[i])
}

function getDateString(dateString)
{
    const dateObj=new Date(Number(dateString))
    const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}_` +
                      `${dateObj.getHours().toString().padStart(2, '0')}-${dateObj.getMinutes().toString().padStart(2, '0')}`;

    return formattedDate
}



function getDateSecString(dateString)
{
	const dateObj=new Date(Number(dateString))
    
	const formattedDate = `${dateObj.getSeconds().toString().padStart(2, '0')}.${dateObj.getMilliseconds()}`;
    return formattedDate
}

function get(dateString)
{
	const dateObj=new Date(Number(dateString))
    
	const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')} ` +
                      `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}.${dateObj.getMilliseconds()}`;
    return formattedDate
}












// const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')} ` +
//                       `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}.${dateObj.getMilliseconds()}`;