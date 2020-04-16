### For further documentation refer to: https://www.bitstamp.net/api/

# Public Methods

## Trading pairs info

- Request

GET https://www.bitstamp.net/api/v2/trading-pairs-info/ => Postman! curl not working... why?

- Response (JSON) - list of trading pairs. Every trading pair dictionary contains:

name - Trading pair.
url_symbol - URL symbol of trading pair.
base_decimals - Decimal precision for base currency (BTC/USD - base: BTC).
counter_decimals - Decimal precision for counter currency (BTC/USD - counter: USD).
minimum_order - Minimum order size.
trading - Trading engine status (Enabled/Disabled).
description - Trading pair description.

# Private Methods

## V2 authentication method

We introduced a new authentication method that allows for easier nonce handling and is much safer since all relevant content is signed.

Since we strive for simplicity and better security, we encourage you to use this new authentication method.

For a successful authentication you need to provide the following authorization headers in your request:

This is available only for API V2 endpoints.

Please note that you do not need to set key, signature and nonce request parameters using this authentication method. You also do not need to set Content-Type header if there is no body.
Request headers
X-Auth - "BITSTAMP" + " " + api_key
X-Auth-Signature - sha256.hmac(string_to_sign, api_secret)
X-Auth-Nonce - Client generated random nonce: lowercase, 36 char string, each nonce can be used only once within a timeframe of 150 seconds.
Example: "f93c979d-b00d-43a9-9b9c-fd4cd9547fa6"
X-Auth-Timestamp - Request departure timestamp UTC in milliseconds. If timestamp is more than 150 seconds from current server time, it will not allow to make the request.
Example: "1567755304968"
X-Auth-Version - "v2"
Content-Type - "application/x-www-form-urlencoded"

string_to_sign is your signature message. Content-Type should not be added to the string if request.body is empty.
The following have to be combined into a single string:

### PYTHON example

"BITSTAMP" + " " + api_key + \
HTTP Verb + \
url.host + \
url.path + \
url.query + \
Content-Type + \
X-Auth-Nonce + \
X-Auth-Timestamp + \
X-Auth-Version + \
request.body

### example end

Below are the details describing each part of the signature message.

"BITSTAMP" + " " + "\$apiKey" - Same as authorization header.

HTTP - Verb The HTTP (uppercase) verb.
Example: "GET", "POST"

url.host - The hostname (lowercase), matching the HTTP "Host" request header field (including any port number).
Example: "www.bitstamp.net"

url.path - The HTTP request path with leading slash.
Example: "/api/v2/balance/"

url.query - Any query parameters or empty string. This should be the exact string sent by the client, including urlencoding.
Example: "?limit=100&sort=asc"

Content-Type - Same as authorization header.

X-Auth-Nonce - Same as authorization header.

X-Auth-Timestamp - Same as authorization header.

X-Auth-Version - Same as authorization header.

request.body - As is.

### PYTHON example

import hashlib
import hmac
import time
import requests
import uuid
import sys

client_id = 'client_id'
api_key = 'api_key'
API_SECRET = b'api_key_secret'

timestamp = str(int(round(time.time() \* 1000)))
nonce = str(uuid.uuid4())
content_type = 'application/x-www-form-urlencoded'
payload = {'offset': '1'}

if sys.version_info.major >= 3:
from urllib.parse import urlencode
else:
from urllib import urlencode

payload_string = urlencode(payload)

message = 'BITSTAMP ' + api_key + \
 'POST' + \
 'www.bitstamp.net' + \
 '/api/v2/user_transactions/' + \
 '' + \
 content_type + \
 nonce + \
 timestamp + \
 'v2' + \
 payload_string
message = message.encode('utf-8')
signature = hmac.new(API_SECRET, msg=message, digestmod=hashlib.sha256).hexdigest()
headers = {
'X-Auth': 'BITSTAMP ' + api_key,
'X-Auth-Signature': signature,
'X-Auth-Nonce': nonce,
'X-Auth-Timestamp': timestamp,
'X-Auth-Version': 'v2',
'Content-Type': content_type
}
r = requests.post(
'https://www.bitstamp.net/api/v2/user_transactions/',
headers=headers,
data=payload_string
)
if not r.status_code == 200:
raise Exception('Status code not 200')

string_to_sign = (nonce + timestamp + r.headers.get('Content-Type')).encode('utf-8') + r.content
signature_check = hmac.new(API_SECRET, msg=string_to_sign, digestmod=hashlib.sha256).hexdigest()
if not r.headers.get('X-Server-Auth-Signature') == signature_check:
raise Exception('Signatures do not match')

print(r.content)

### example end

Note: '' (empty string) in message represents any query parameters or an empty string in case there are none

## User transactions

This call will be executed on the account (Sub or Main), to which the used API key is bound to.

Request:

POST - https://www.bitstamp.net/api/v2/user_transactions/API
Returns transactions for all currency pairs.
POST - https://www.bitstamp.net/api/v2/user_transactions/{currency_pair}/API
Supported values for currency_pair: btcusd, btceur, eurusd, xrpusd, xrpeur, xrpbtc, ltcusd, ltceur, ltcbtc, ethusd, etheur, ethbtc, bchusd, bcheur, bchbtc

- Request parameters:

key - API key.
signature - Signature.
nonce - Nonce (MyHint: unix epoch is a common value to asign to it)
offset - Skip that many transactions before returning results (default: 0, maximum: 200000).
If you need to export older history contact support OR use combination of limit and since_id parameters
limit - Limit result to that many transactions (default: 100; maximum: 1000).
sort - Sorting by date and time: asc - ascending; desc - descending (default: desc).
since_timestamp - (Optional) Show only transactions from unix timestamp (for max 30 days old). API v2
since_id - (Optional) Show only transactions from specified transaction id. API v2

- Response (JSON): success - Returns a descending list of transactions, represented as dictionaries.

datetime - Date and time.
id - Transaction ID.
type - Transaction type: 0 - deposit; 1 - withdrawal; 2 - market trade; 14 - sub account transfer.
usd - USD amount.
eur - EUR amount.
btc - BTC amount.
xrp - XRP amount.
ltc - LTC amount.
eth - ETH amount.
bch - BCH amount.
btc_usd - (or other trading pair used, eg btc_eur) Exchange rate.
fee - Transaction fee.
order_id - Executed order ID.

- Response (JSON): failure

status - "error"
reason - The reason for the error.

## Crypto Transactions

This call will be executed on the account, to which the used API key is bound to. This call is for your main account only.

- Request

POST - https://www.bitstamp.net/api/v2/crypto-transactions/

Returns data for all cryptocurrency deposits and withdrawals.

- Request parameters

key - API key.
signature - Signature.
nonce - Nonce.
limit - Limit result to that many transactions (default: 100; minimum: 1; maximum: 1000).
offset - Skip that many transactions before returning results (default: 0, maximum: 200000).

- Response (JSON): success - Returns list of cryptocurrency deposits and withdrawals, where each transaction is represented as a dictionary.

currency - Currency
destinationAddress - Destination Address
txid - Transaction Hash
amount - Amount
datetime - Date and Time

- Response (JSON): failure

status - "error"
reason - The reason for the error.
