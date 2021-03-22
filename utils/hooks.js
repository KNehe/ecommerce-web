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

const useSingleOrder = (router,singleOrder,setLoading) =>{
    if(!(Object.keys(singleOrder).length >0)){
       router.replace('/')
    }else{
        setLoading(false)
    }
}

const usePaymentMethod= (router,shippingDetails,cart,setScreenLoad) =>{
    if( cart.length == 0 ){
       router.replace('/')
    }else if(!(Object.keys(shippingDetails).length > 0)){
        router.replace('/shipping_details')
    }else{
        setScreenLoad(false)
    }
}


export {useAuthRedirect,usePreFetch,usePreFetchUrls,
        useSingleOrder, usePaymentMethod}