import { useSelector } from 'react-redux'
import styles from '../../styles/SignInRequest.module.scss'
import { VIEWING_ORDER_HISTORY } from "../../consts/activities";

const SignInRequest  =({isLoggedIn,jwtValid,click})=>{

    const currentActivity = useSelector(state => state.currentActivity)

return  <div className={styles.no_profile_access_display}>
        {!isLoggedIn?
            <p> Please sign in to see {currentActivity === VIEWING_ORDER_HISTORY?
            'order history': 'profile'}</p>:
            !jwtValid ?
            <p>Session expired. Please sign in to see
                {currentActivity === VIEWING_ORDER_HISTORY?
            ' order history': 'profile'}
            </p>:
            <p> Please sign in to see profile</p>
        }
        <div className={styles.btn_signin}
            onClick={click}
        >
            Sign in
        </div>
</div>
}

export default SignInRequest