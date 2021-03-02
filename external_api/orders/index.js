import axios from '../../axios/index'

const sendPayPalOrder = async(order,nonce) =>{

    let result, errorMsg;

    try{
      const response = await axios.post(`/cart/braintree/paypalpayment/${nonce}`,{...order});
      result = response.data.data;
    }catch(error){
        errorMsg = error.message;
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

export {sendPayPalOrder, getTax, getShippingCost}