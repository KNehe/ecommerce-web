import axios from 'axios';

const local_api = 'http://localhost:8080/api/v1'
const baseApiURL = 'https://nehe-ecommerce-api.herokuapp.com/api/v1';

const axiosInstnace = axios.create({
    baseURL:baseApiURL
});

if(typeof window != 'undefined'){
    axiosInstnace.defaults.headers['authorization'] = `Bearer ${localStorage.getItem('nehe-ecommerce-app-jwt-token')}`;
}

export default axiosInstnace;