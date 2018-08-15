Isomorphic JSON-RPC 2.0 client for browser and Node.js with logging curl and time.

# Installation

```shell
yarn add js-jsonrpc-request
```

or

```shell
npm install js-jsonrpc-request --save
```

# Usage

```js
import JsonRpcClient from 'js-jsonrpc-request';

const jsonrpc = new JsonRpcClient({
    apiRoute: '/api/rpc/v1.0',
    headers: {
        'X-API-CLIENT': 'key',
    },
    withMeta: true,
});

jsonrpc
    .request('info.getSomething', { data: 'something' })
    .then(({ data, meta }) => {
        console.log('Data', data);
        console.log('Curl', meta.curl);
        console.log('Time for request', `${meta.timeRequest} ms`);
    })
    .catch((err) => console.log('ERROR', err));
```

`data` - data response from API

`curl` - curl for request API, for example

```shell
curl -i -X POST -H 'Content-Type: application/json' -H 'X-API-CLIENT: key' --data-binary '{"jsonrpc":"2.0","method":"info.getSomething","params":{"data":"something"},"id":1}' 'http://example.com/api/rpc/v1.0'
```

`timeRequest` - time in ms for request (for example 305 ms)

Also, you can add additional options to request. Support options: `headers`. It will be added to headers in constructor.

```js
jsonrpc.request('info.getSomething', { data: 'something' }, { headers: {'X-ACCESS_TOKEN': 'token' }});
```
