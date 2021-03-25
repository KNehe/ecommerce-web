import {UNKNOWN_ERROR} from '../consts/errors'

const getAxiosErrorMessage = (error) =>{
    return error?.response?.data?.message || UNKNOWN_ERROR;
}

export { getAxiosErrorMessage }