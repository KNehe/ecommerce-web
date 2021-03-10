import axios from '../../axios/index'

const isJwtValid  = async ( jwt ) =>{
  
    try{
      const response = await axios.post(`/users/checktokenexpiry`,{token:jwt});
      return response.status === '200'
    }catch(error){
      return false
    }
    }

  export {isJwtValid}