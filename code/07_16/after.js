/**
 * @typedef Character
 * @property {string} slug
 * @property {number} polarity
 * @property {house} slug
 */
/**
 * @typedef House
 * @property {string} slug
 * @property {Character[]} members
 */

const https = require('https');


const GOTAPI_PREIFX = `https://game-of-thrones-quotes.herokuapp.com/v1`

/**
 * 
 * @param {string} url 
 * @returns {*}
 */
async function getHttpsJSON(url){
    return new Promise(resolve =>{
        https.get(url, res =>{
            let jsonStr = ''
            res.setEncoding('utf-8')
            res.on('data', (data)=>{
                jsonStr += data;
            })
            res.on('end', ()=>{
                try{
                    const parsed = JSON.parse(jsonStr);
                    resolve(parsed)
                // eslint-disable-next-line node/no-unsupported-features/es-syntax
                }catch{
                    rejects(
                        new Error('the server is no responce')
                    )
                }
            })
        })
    })
}

/**
 * @returns {Promise<House[]>}
 */
async function getHouses(){
    return getHttpsJSON(`${GOTAPI_PREIFX}/houses`)
}
/**
 * @param {string} quote
 * @returns {string}
 */
function sanitizeQuote(quote){
    return quote.replace(/[^a-zA-Z0-9., ]/g, '')
}

/**
 * 
 * @param {string} slug 
 * @returns {Promise<string>}
 */
async function getMergedQuotesOfCharacter(slug){
    const character = await getHttpsJSON(`${GOTAPI_PREIFX}/character/${slug}`)
    return sanitizeQuote(character[0].quotes.join(' ')); 
    
}
/**
 * 
 * @param {string} quote 
 */
async function getSentimAPIResults(quote){
    return new Promise((resolve, reject)=>{
        const body = JSON.stringify({
            text: quote,
        })
    
        const postReq = https.request(
            {
              hostname: 'sentim-api.herokuapp.com',
              method: 'POST',
              path: '/api/v1/',
              headers: {
                Accept: 'application/json; encoding=utf-8',
                'Content-Type': 'application/json; encoding=utf-8',
                'Content-Length': body.length,
              },
            }, (res) =>{
                let jsonStr = '';
                res.setEncoding('utf-8')
                res.on('data', (data)=>{
                    jsonStr += data;
                })
                res.on('end', ()=>{
                    try{
                        resolve(JSON.parse(jsonStr))
                    // eslint-disable-next-line node/no-unsupported-features/es-syntax
                    }catch{
                        reject(new Error("not valid json"))
                    }
                    
                })
            }
        )
        postReq.write(body)
    })
    
}
/**
 * @param {number[]} numbers 
 * @return {number}
 */
function sum(numbers){
    return numbers.reduce((memo,cur)=> memo+cur, 0);
}

async function main(){
    const houses = await getHouses();

    const characters = await Promise.all(
        houses
        .map((house)=>
            house.members.map((member)=> getMergedQuotesOfCharacter(member.slug).then(quote =>({
                house : house.slug,
                member : member.slug,
                quote
            })))
        )
        .flat()
    )
    const charactersWithPolarity = await Promise.all(
        characters.map(async (character) => {
            const result = await getSentimAPIResults(character.quote)
            return ({
                ...character,
                polarity: result.result.polarity
            })
        })
    )
    /** @type {Object.<string, Character[]>} */
    const charactersByHouseSlug = {}

    charactersWithPolarity.forEach(character =>{
        charactersByHouseSlug[character.house] =
        charactersByHouseSlug[character.house] || [];
        charactersByHouseSlug[character.house].push(character)

    })
    const houseSlugs = Object.keys(charactersByHouseSlug)
    const result = houseSlugs.map(houseSlug =>{
        const charactersOfHouse = charactersByHouseSlug[houseSlug]
        if(!charactersOfHouse) return undefined
        const sumPolarity = sum(charactersOfHouse.map(characterOfHouse => characterOfHouse.polarity))
        const avergePolarity = sumPolarity / charactersOfHouse.length
        return [houseSlug, avergePolarity]
    }).sort((a,b)=> a[1]-b[1])
    console.log(result)

}

main();