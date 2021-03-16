import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/layout/layout";
import { SUCCESS_ORDER } from "../consts/navbar_titles";
import { SET_NAVBAR_TITLE } from "../state/actions";
import styles from '../styles/ThankYou.module.scss'

const ThankYou = () =>{

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch({type: SET_NAVBAR_TITLE, payload: SUCCESS_ORDER})
    },[])

    return <Layout title='Thank you'>

        <section className={styles.thank_you}>
            <FontAwesomeIcon icon={faStar}/>
            <p>Payment made successfully</p>
            <Link href='/single_order'>
                <button>View Order</button>
            </Link>
        </section>

    </Layout>
}

export default ThankYou;