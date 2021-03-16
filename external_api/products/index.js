import axios from '../../axios/index'
import { getAxiosErrorMessage } from '../../utils/object_property_pickers';

const getProducts = async (page,limit)=>{
  let data, errorMessage;

  try{
    const response = await axios.get(`/products/page/${page}/limit/${limit}`);
    data = response.data.data;
  }catch(error){
    errorMessage = getAxiosErrorMessage(error);
  }

  return {data, errorMessage}
}

const getProductsByCategory = async (category) =>{
  let data, errorMessage;

  try{
    const response = await axios.get(`/products/search/category/${category}`);
    data = response.data.data;
  }catch(error){
    errorMessage = getAxiosErrorMessage(error);;
  }

  return {data, errorMessage}
}

const getProductsByNameOrCategory = async(searchKey) =>{
  
  let data, errorMessage;

  try{
    const response = await axios.get(`/products/search/${searchKey}`);
    data = response.data.data.result;
  }catch(error){
    errorMessage = getAxiosErrorMessage(error);;
  }

  return {data, errorMessage}
}

const getProductsWithoutPaginaton = async () =>{
  let data, errorMessage;

  try{
    const response = await axios.get(`/products/`);
    data = response.data.data;
  }catch(error){
    errorMessage = getAxiosErrorMessage(error);
  }

  return {data, errorMessage}
}

const getOneProduct = async (id) =>{
  let data, errorMessage;

  try{
    const response = await axios.get(`/products/${id}`);
    data = response.data.data;
  }catch(error){
    errorMessage = getAxiosErrorMessage(error);;
  }

  return {data, errorMessage}
}

export {getProducts,getProductsByCategory,
        getProductsByNameOrCategory, getProductsWithoutPaginaton,
        getOneProduct
      }