import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/layout/layout";
import { SUCCESS_ORDER } from "../consts/navbar_titles";
import { SET_CURRENT_ACTIVITY, SET_NAVBAR_TITLE } from "../state/actions";
import styles from '../styles/ThankYou.module.scss'
import { useRouter  } from "next/router";
import { VIEWING_SINGLE_ORDER } from "../consts/activities";
import { usePreFetchUrls, useSingleOrder } from "../utils/hooks";
import ProgressIndicator from '../components/progress_indicator/progress_indicator'

const ThankYou = () =>{

    const dispatch = useDispatch()

    const router = useRouter()

    const singleOrder = useSelector(state =>state.singleOrder)

    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        useSingleOrder(router,singleOrder,setLoading)
        dispatch({type: SET_NAVBAR_TITLE, payload: SUCCESS_ORDER })
        usePreFetchUrls(['/single_order'],router)
    },[])

    const onBtnClickedHandler = async event =>{

        event.preventDefault()

        dispatch({type: SET_CURRENT_ACTIVITY, payload: VIEWING_SINGLE_ORDER})

        await router.replace('/single_order')
    }

    return <Layout title='Thank you'>

        {
            loading?
            <ProgressIndicator/>:
            <section className={styles.thank_you}>
                <FontAwesomeIcon icon={faStar}/>
                <p>Payment made successfully</p>
                <button onClick={onBtnClickedHandler}>View Order</button>
            </section>
        }

    </Layout>
}

export default ThankYou;