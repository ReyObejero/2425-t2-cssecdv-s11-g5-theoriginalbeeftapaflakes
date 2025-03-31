import axios from 'axios';

const instance = axios.create({
    baseURL: `https://two324-t3-stsweng-s11-g6.onrender.com/`,
    withCredentials: true,
});

export default instance;
