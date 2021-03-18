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

  export {saveCart}