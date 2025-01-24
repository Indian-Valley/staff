import EventSource from "react-native-sse";

import ENDPOINTS from "./EndPoints";

const BASE_URL = 'https://indian-valley-server.onrender.com'
// const BASE_URL = 'http://localhost:3000'

class APIMethods {
    static apiRequest(method, url, body = {}) {
        url = BASE_URL + url;
        return new Promise((resolve, reject) => {
            fetch(url, Object.keys(body).length > 0 ? {method, body: JSON.stringify(body)} : {method})
                .then(res => res.json())
                .then(resolve)
                .catch(reject);
        })
    }

    static get(url) {
        return this.apiRequest('GET', url);
    }

    static post(url, data) {
        return this.apiRequest('POST', url, data);
    }

    static put(url, data) {
        return this.apiRequest('PUT', url, data);
    }

    static patch(url) {
        return this.apiRequest('PATCH', url);
    }

    static delete(url) {
        return this.apiRequest('DELETE', url);
    }

    static events() {
        return new EventSource(BASE_URL + ENDPOINTS.EVENTS(), {
            headers: {
                "Content-Type": "text/event-stream",
                // Authorization: `Bearer ${OPENAI_KEY}`,
            },
            method: "GET",
            pollingInterval: 25000
        });
    }
}

export default APIMethods;