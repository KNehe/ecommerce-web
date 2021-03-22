import  {isJwtValid} from '../external_api/users/index'
import { CHECKING_OUT, VIEWING_ORDER_HISTORY, VIEWING_PROFILE } from '../consts/activities'

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

const usePreFetch = (currentActivity,router) =>{

        switch (currentActivity) {
            case CHECKING_OUT:
                router.prefetch('/shipping_details')
                break;
            case VIEWING_PROFILE:
                router.prefetch('/user-profile')
                break;
            case VIEWING_ORDER_HISTORY:
                router.prefetch('/order_history') 
                break;       
            default:
                router.prefetch('/')
                break;
        } 
}

const usePreFetchUrls = (urls,router) =>{

    if(urls){
        urls.forEach(url => {
                router.prefetch(url)            
        })
    }

}

export {useAuthRedirect,usePreFetch,usePreFetchUrls}