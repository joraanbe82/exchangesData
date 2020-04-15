### For further documentation refer to: https://docs.poloniex.com/

# Private HTTP API Methods

The private HTTP API allows read / write access to your private account.
Private HTTP URL: `https://poloniex.com/tradingApi`

All calls to the trading API are sent via HTTP using POST parameters to https://poloniex.com/tradingApi and must contain the following headers:

    Key - Your API key.
    Sign - The query's POST data signed by your key's "secret" according to the HMAC-SHA512 method.

Additionally, all queries must include a "nonce" POST parameter. The nonce parameter is an integer which must always be greater than the previous nonce used and does not need to increase by one. Using the epoch in milliseconds is an easy choice here but be careful about time synchronization if using the same API key across multiple servers.

All responses from the trading API are in JSON format. In the event of an error, the response will always be of the following format:

{ "error": "<error message>" }

There are several methods accepted by the trading API, each of which is specified by the "command" POST parameter:

## returnTradeHistory (private)

Returns your trade history for a given market, specified by the "currencyPair" POST parameter. You may specify "all" as the currencyPair to receive your trade history for all markets. You may optionally specify a range via "start" and/or "end" POST parameters, given in UNIX timestamp format; if you do not specify a range, it will be limited to one day. You may optionally limit the number of entries returned using the "limit" parameter, up to a maximum of 10,000. If the "limit" parameter is not specified, no more than 500 entries will be returned.

- Input Fields

currencyPair - The major and minor currency that define this market. (or 'all' for all markets)

- Output Fields

Field - Description
globalTradeID - The globally unique identifier of this trade.
tradeID - The identifier of this trade unique only within this trading pair.
date - The UTC date at which this trade executed.
rate - The rate at which this trade executed.
amount - The amount transacted in this trade.
total - The total cost in base units of this trade.
fee - The fee paid for this trade.
orderNumber - The order number to which this trade is associated.
type - Denotes a 'buy' or a 'sell' execution.
category - Denotes if this was a standard or margin exchange.

Note: set the nonce to the current milliseconds. For example: date +%s00000

### example

echo -n "command=returnTradeHistory&currencyPair=BTC_ETH&nonce=154264078495300" | \
openssl sha512 -hmac \$API_SECRET

curl -X POST \
 -d "command=returnTradeHistory&currencyPair=BTC_ETH&nonce=154264078495300" \
 -H "Key: 7BCLAZQZ-HKLK9K6U-3MP1RNV9-2LS1L33J" \
 -H "Sign: 2a7849ecf...ae71161c8e9a364e21d9de9" \
 https://poloniex.com/tradingApi

- Example output for a single market:

[ { globalTradeID: 394700861,
tradeID: 45210354,
date: '2018-10-23 18:01:58',
type: 'buy',
rate: '0.03117266',
amount: '0.00000652',
total: '0.00000020',
orderNumber: '104768235093' },
{ globalTradeID: 394700815,
tradeID: 45210353,
date: '2018-10-23 18:01:08',
type: 'buy',
rate: '0.03116000',
amount: '5.93292717',
total: '0.18487001',
orderNumber: '104768235092' },
...
{ globalTradeID: 394699047,
tradeID: 45210256,
date: '2018-10-23 17:30:32',
type: 'sell',
rate: '0.03114533',
amount: '0.01934000',
total: '0.00060235',
orderNumber: '104768235091' },
{ globalTradeID: 394698946,
tradeID: 45210255,
date: '2018-10-23 17:28:55',
type: 'sell',
rate: '0.03114126',
amount: '0.00018753',
total: '0.00000583',
orderNumber: '104768235090' } ]

- Example output for all markets:

{ BTC_BCH:
[ { globalTradeID: 394131412,
tradeID: '5455033',
date: '2018-10-16 18:05:17',
rate: '0.06935244',
amount: '1.40308443',
total: '0.09730732',
fee: '0.00100000',
orderNumber: '104768235081',
type: 'sell',
category: 'exchange' },
...
{ globalTradeID: 394126818,
tradeID: '5455007',
date: '2018-10-16 16:55:34',
rate: '0.06935244',
amount: '0.00155709',
total: '0.00010798',
fee: '0.00200000',
orderNumber: '104768179137',
type: 'sell',
category: 'exchange' } ],
BTC_STR:
[ { globalTradeID: 394127362,
tradeID: '13536351',
date: '2018-10-16 17:03:43',
rate: '0.00003432',
amount: '3696.05342780',
total: '0.12684855',
fee: '0.00200000',
orderNumber: '96238912841',
type: 'buy',
category: 'exchange' },
...
{ globalTradeID: 394127361,
tradeID: '13536350',
date: '2018-10-16 17:03:43',
rate: '0.00003432',
amount: '3600.53748129',
total: '0.12357044',
fee: '0.00200000',
orderNumber: '96238912841',
type: 'buy',
category: 'exchange' } ] }
