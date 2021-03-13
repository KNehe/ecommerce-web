const getAxiosErrorMessage = (error) =>{
    return error.response.data.message
}

export { getAxiosErrorMessage }