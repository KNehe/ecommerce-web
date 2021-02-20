import axios from '../../axios/index'

const getCategories = async() =>{

    let categories, errorMsg;

    try{
      const response = await axios.get(`/categories/`);
      categories = response.data.data;
    }catch(error){
        errorMsg = error;
    }
  
    return {categories, errorMsg}

}

export {getCategories}