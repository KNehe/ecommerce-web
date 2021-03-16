import axios from '../../axios/index'
import { getAxiosErrorMessage } from '../../utils/object_property_pickers';

const sendPayPalOrder = async(order,nonce) =>{
    let result, errorMsg;

    try{
      const response = await axios.post(`/cart/braintree/paypalpayment/${nonce}`,{...order});
      result = response.data.data;
    }catch(error){
        errorMsg = getAxiosErrorMessage(error);
    }
  
    return {result, errorMsg}

}

//can be used to get tax from api
const getTax = async () =>{
    return 200;
}

//can be used to get shipping details from api
const getShippingCost = async () =>{
    return 40;
}

const sendStripeOrder = async (stripeId, order) =>{
    let result, errorMsg;

    try{
      const response = await axios.post(`/cart/stripe/stripeid/${stripeId}`,{...order});
      result = response.data.data;
    }catch(error){
        errorMsg = getAxiosErrorMessage(error);
    }
  
    return {errorMsg,result}

}

export {sendPayPalOrder, getTax, getShippingCost, sendStripeOrder}