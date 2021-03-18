import axios from '../../axios/index'
import { getAxiosErrorMessage } from '../../utils/object_property_pickers';

const saveCart = async (productId,userId,quantity,jwt) =>{
    let result, errorMsg;
    
    try{
      axios.defaults.headers['authorization'] = `Bearer ${jwt}`;

      const response = await axios.post(`/cart/`,{productId,userId,quantity});
      result = response.data.message;
  
    }catch(error){
        console.log(error)
        errorMsg = getAxiosErrorMessage(error);
    }
  
    return {errorMsg,result}
  
  }

const getSavedCart = async (userId,jwt) =>{

  let cart, errorMsg;
    
  try{
    axios.defaults.headers['authorization'] = `Bearer ${jwt}`;

    const response = await axios.get(`/cart/${userId}`);
    cart = response.data.data.cart;

  }catch(error){
      errorMsg = getAxiosErrorMessage(error);
  }

  return {errorMsg,cart}

}

const deleteCart = async (userId,jwt) =>{

  let status, errorMsg;
    
  try{
    axios.defaults.headers['authorization'] = `Bearer ${jwt}`;

    const response = await axios.delete(`/cart/${userId}`);
    status = response.status;

  }catch(error){
      errorMsg = getAxiosErrorMessage(error);
  }

  return {errorMsg,status}

}

  export {saveCart,getSavedCart,deleteCart}