import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/layout/layout";
import { SUCCESS_ORDER } from "../consts/navbar_titles";
import { SET_CURRENT_ACTIVITY, SET_NAVBAR_TITLE } from "../state/actions";
import styles from '../styles/ThankYou.module.scss'
import { useRouter  } from "next/router";
import { VIEWING_SINGLE_ORDER } from "../consts/activities";

const ThankYou = () =>{

    const dispatch = useDispatch()

    const router = useRouter()

    useEffect(()=>{
        dispatch({type: SET_NAVBAR_TITLE, payload: SUCCESS_ORDER})

        router.prefetch('/single_order')
    },[])

    const onBtnClickedHandler = async event =>{

        event.preventDefault()

        dispatch({type: SET_CURRENT_ACTIVITY, payload: VIEWING_SINGLE_ORDER})

        await router.push('/single_order')
    }

    return <Layout title='Thank you'>

        <section className={styles.thank_you}>
            <FontAwesomeIcon icon={faStar}/>
            <p>Payment made successfully</p>
                <button onClick={onBtnClickedHandler}>View Order</button>
        </section>

    </Layout>
}

export default ThankYou;