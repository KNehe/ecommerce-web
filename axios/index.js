import axios from 'axios';

const baseApiURL = 'https://nehe-ecommerce-api.herokuapp.com/api/v1/';

const axiosInstnace = axios.create({
    baseURL:baseApiURL
});

if(typeof window != 'undefined'){
    axiosInstnace.defaults.headers['authorization'] = `Bearer ${localStorage.getItem('nehe-ecommerce-app-jwt-token')}`;
}

export default axiosInstnace;