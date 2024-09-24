import axios from 'axios';
// import { refreshToken } from './auth';

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/v1'
});

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // if (error.response && error.response.status === 401) {
    //     return refreshToken().then(() => {
    //         return instance(error.config);
    //     });
    // }
    return Promise.reject(error);
}
);



export default instance;
