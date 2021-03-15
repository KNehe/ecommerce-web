import axios from '../../axios/index'
import { getAxiosErrorMessage } from '../../utils/object_property_pickers';

const isJwtValid  = async ( jwt ) =>{
  
    try{
      const response = await axios.post(`/users/checktokenexpiry`,{token:jwt});
      return response.status === '200'
    }catch(error){
      return false
    }
}

const signIn = async (email,password) =>{
  let result, errorMsg;
  
  try{
    const response = await axios.post(`/users/signin`,{email,password});
    result = response.data.data;

  }catch(error){
      errorMsg = getAxiosErrorMessage(error);
  }

  return {errorMsg,result}

}

const signUp = async (name,email,password) =>{
  let result, errorMsg;
  
  try{
    const response = await axios.post(`/users/signup`,{name,email,password});
    result = response.data.data;

  }catch(error){
      errorMsg = getAxiosErrorMessage(error);
  }

  return {errorMsg,result}

}


  export {isJwtValid,signIn,signUp}