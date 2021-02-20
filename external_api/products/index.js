import axios from '../../axios/index'

const getProducts = async (page,limit)=>{
  let data, errorMessage;

  try{
    const response = await axios.get(`/products/page/${page}/limit/${limit}`);
    data = response.data.data;
  }catch(error){
    errorMessage = error;
  }

  return {data, errorMessage}
}

export {getProducts}