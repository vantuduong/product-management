import HTTP from "../http";

// const token = localStorage.getItem('access_token');

export default {
    get(uri, params = {}) {
        const token = localStorage.getItem('access_token');
        return HTTP.get(uri, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            return response.data;
        })
    },

    post(uri, data = {}) {
        const token = localStorage.getItem('access_token');

        return HTTP.post(uri, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            return response.data;
        })
    },

    postNoAuth(uri, data = {}) {

        return HTTP.post(uri, data).then(response => {
            return response.data;
        })
    },

    put(uri, data = {}) {
        const token = localStorage.getItem('access_token');

        return HTTP.put(uri, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            return response.data;
        })
    },

    delete(uri) {
        const token = localStorage.getItem('access_token');

        return HTTP.delete(uri, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            return response.data;
        })
    }
}
