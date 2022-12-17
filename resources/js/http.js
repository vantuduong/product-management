import axios from 'axios';
import Vue from 'vue';

const HTTP = axios.create({
    baseURL: `/api`,
    headers: {
        Accept: 'application/json'
    }
});

const errorHandler = (error) => {
    Vue.$toast.error(error.response.data.message, {
        position: 'top-right'
    });

    return Promise.reject({ ...error })
};

HTTP.interceptors.response.use(
    response => response,
    error => errorHandler(error)
);

export default HTTP;
