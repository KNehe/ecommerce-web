import { CHECKING_OUT } from '../consts/activities'

const navigate = (currentActivity,router) =>{

    switch (currentActivity) {
        case CHECKING_OUT:
            router.push('/shipping_details')
            break;
    
        default:
            router.push('/')
            break;
    }

}

export {navigate} 