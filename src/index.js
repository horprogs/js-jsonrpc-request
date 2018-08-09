// @flow

import axios from 'axios';
import { Promise } from 'es6-promise';

const getUniqId = (() => {
    let counter = 0;

    return () => {
        counter += 1;

        if (!Number.isSafeInteger(counter)) {
            counter = 0;
        }

        return counter;
    };
})();

class JsonRpcClient {
    static allowedFields = ['asCurl', 'getCacheKey', 'getRequestOptions'];

    static defaultHeaders = {
        'Content-Type': 'application/json',
    };

    constructor({ apiRoute, headers = {} }: { apiRoute: string }) {
        this.apiRoute = apiRoute;
        this.headers = { ...JsonRpcClient.defaultHeaders, ...headers };
    }

    asCurl() {
        const options = {};

        const headers = Object.keys(options.headers).map(
            key => `-H '${key}: ${options.headers[key]}'`
        );

        return [
            'curl -i',
            '-X POST',
            headers.join(' '),
            `--data-binary '${options.body}'`,
            `'${options.uri}'`,
        ].join(' ');
    }

    request(method, params) {
        const body = {
            jsonrpc: '2.0',
            method,
            params,
            id: getUniqId(),
        };

        return new Promise((resolve, reject) => {
            axios
                .post(this.apiRoute, body, { headers: this.headers })
                .then(({ data: res }) => {
                    if (!res) {
                        reject({ error: 'Unknown error' });
                        return;
                    }

                    if (res.error) {
                        reject({
                            error: res.error.message,
                            code: res.error.code,
                        });
                        return;
                    }

                    resolve(res.result);
                });
        });
    }
}

const json = new JsonRpcClient({
    apiRoute: '/api/rpc/v1.0',
    headers: {
        'X-API-CLIENT': 'key',
    },
});

json.request('dictionary.getPositions', {})
    .then((data) => console.log('SUCCESS', data))
    .catch((err) => console.log('ERROR', err));
