// @ts-check

const fs = require('fs');

const rs = fs.createReadStream('local/jsons', {
    encoding: 'utf-8',
    highWaterMark : 6,
});
let totalSum = 0;
let accumulatedJsonStr = ''
rs.on('data', (data)=>{
    console.log("Event: data");

    if(typeof data !== 'string') return
    console.log(data);
    totalSum += data 
    .split('\n')
    .map((jsonLine)=>{
        try{
            return JSON.parse(jsonLine);
        }catch{
            return undefined;
        }
    })
    .filter((json) => json)
    // @ts-ignore
    .map((json) => json.data)
    .reduce((sum, cur) => sum+cur, 0)
});

rs.on('end', ()=>{
    console.log("Event : end");
    console.log("sum :", totalSum);
})