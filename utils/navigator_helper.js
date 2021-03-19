import { CHECKING_OUT, VIEWING_PROFILE } from '../consts/activities'

const navigate = (currentActivity,router) =>{

    switch (currentActivity) {
        case CHECKING_OUT:
            router.push('/shipping_details')
            break;
        case VIEWING_PROFILE:
            router.push('/user-profile')
            break;    
        default:
            router.push('/')
            break;
    }

}

export {navigate} 