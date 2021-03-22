import  {isJwtValid} from '../external_api/users/index'

const useAuthRedirect = async (isLoggedIn,jwt,router,setScreenLoad) =>{

    const isTokenValid = await isJwtValid(jwt)

    if(!isLoggedIn){
        setScreenLoad(false)
    }else if(!isTokenValid){
        setScreenLoad(false)
    }else{
        router.replace('/')
    }

}

export {useAuthRedirect}