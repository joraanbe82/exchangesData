const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const crypto  = require('crypto');
const Poloniex = require('poloniex-api-node');



const apiKey= process.env.API_KEY;
const apiSecret= process.env.API_SECRET;
const url = `https://poloniex.com/tradingApi?command=returnTradeHistory&currencyPair=allH&nonce=${new Date().getTime()}`

const start = new Date(2018, 08, 20).getTime()
const end = new Date(2019, 09, 16).getTime()
//poloniex.method(arg1, arg2)
//.then(function (data) { console.log(data) })
//.catch(function (err) { console.error(err) });
console.log( start + " - " + end)
const poloniex =  new Poloniex(apiKey, apiSecret);
// returnMyTradeHistory(currencyPair, start, end, limit [, callback])

router.post('/tradeHistory', async (request, response) => {
    try {
  
    let result = await poloniex.returnMyTradeHistory('all', start, end, 500)
    console.log("result " , result)

    response.send(result)
    } catch(error) {
        console.log(error)
    }
})

router.post('/balances', (request, response) => {

    let result = poloniex.returnBalances()
    .then(balances => console.log(balances))
    .catch(error => {throw error})
    console.log("RESULT " , result)
    console.log("BALANCES " , balances)
    response.send(result)
})




// poloniex.returnBalances().then((balances) => {
//     console.log(balances);
//   }).catch((err) => {
//     console.log(err.message);
//   });

// Sign - The query's POST data signed by your key's "secret" according to the HMAC-SHA512 method.

// const parameters = {
//     command: 'returnTradeHistory',
//     currencyPair: 'all',
//     nonce: `${new Date().getTime()}`
// }

// // Convert to `arg1=foo&arg2=bar`
//  const paramString = Object.keys(parameters).map(function (param) {
//     return encodeURIComponent(param) + '=' + encodeURIComponent(parameters[param]);
//   }).join('&');

//   console.log("paramString " + paramString)

// const signature = crypto.createHmac('sha512', apiSecret).update(paramString).digest('hex');

// console.log(signature)
// console.log(url);



// router.post('/tradeHistory', (request, response) => {
//     fetch(url, {
//          headers: {
//             "Key": apiKey,
//             "Sign": signature,
//             'Content-Type': 'application/x-www-form-urlencoded'         
//         }        
//     })
//     .then(res => res.json())
//     .then(json => console.log(json))
//     .catch(error => {throw error})
// })


module.exports = router;