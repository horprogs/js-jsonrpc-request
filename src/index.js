// @flow
import axios from 'axios';
import { Promise } from 'es6-promise';

class JsonRpcClient {
    apiRoute: string;
    headers: {};
    withMeta: ?boolean;
    requestId: number;

    static defaultHeaders = {
        'Content-Type': 'application/json',
    };

    static getUniqId = (() => {
        let counter = 0;

        return () => {
            counter += 1;

            if (!Number.isSafeInteger(counter)) {
                counter = 0;
            }

            return counter;
        };
    })()

    constructor({
        apiRoute,
        headers = {},
        withMeta,
    }: {
        apiRoute: string,
        headers: {},
        withMeta: boolean,
    }) {
        this.apiRoute = apiRoute;
        this.headers = { ...JsonRpcClient.defaultHeaders, ...headers };
        this.withMeta = withMeta;
    }

    asCurl(method: string, params: {}, id: number) {
        const options = {
            jsonrpc: '2.0',
            method,
            params,
            id,
        };

        const headers = Object.keys(this.headers).map(
            (key) => `-H '${key}: ${this.headers[key]}'`
        );

        return [
            'curl -i',
            '-X POST',
            headers.join(' '),
            `--data-binary '${JSON.stringify(options)}'`,
            `'${this.apiRoute}'`,
        ].join(' ');
    }

    request(method: string, params: {}) {
        this.requestId = JsonRpcClient.getUniqId();

        const body = {
            jsonrpc: '2.0',
            method,
            params,
            id: this.requestId,
        };

        const startTime = new Date();

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

                    let meta = {};

                    if (this.withMeta) {
                        meta = {
                            curl: this.asCurl(method, params, this.requestId),
                            timeRequest: new Date() - startTime,
                        };
                    }

                    resolve({ data: res.result, meta });
                })
                .catch((err) => {
                    if (err.response) {
                        reject({
                            error: err.response.statusText,
                            code: err.response.status,
                        });
                        return;
                    }

                    reject({
                        error: 'Unknown error',
                    });
                });
        });
    }
}

export default JsonRpcClient;
