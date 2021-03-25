import axios from '../../axios/index'
import { getAxiosErrorMessage } from '../../utils/object_property_pickers';

const getCategories = async() =>{

    let categories, errorMsg;

    try{
      const response = await axios.get(`/categories/`);
      categories = response.data.data;
    }catch(error){
        errorMsg = getAxiosErrorMessage(error);
    }
  
    return {categories, errorMsg}

}

export {getCategories}