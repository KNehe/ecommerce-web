import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Layout from "../components/layout/layout"
import { VIEWING_ORDER_HISTORY } from "../consts/activities"
import { SET_NAVBAR_TITLE } from "../state/actions"
import styles from '../styles/SingleOrder.module.scss'
import { useSingleOrder } from "../utils/hooks"
import {useRouter} from 'next/router'
import ProgressIndicator from '../components/progress_indicator/progress_indicator'
import { useState } from "react"

const SingleOrder = () =>{

    const state = useSelector(state => state)

    const dispatch = useDispatch()

    const router = useRouter()

    const { singleOrder } = state
    
    const [loading,setLoading] = useState(true)

    const [items,setItems] = useState([])

    useEffect(async()=>{
        dispatch({type: SET_NAVBAR_TITLE, payload: `Order ${state.singleOrder._id ? state.singleOrder._id :''}` })
        
        useSingleOrder(router,singleOrder,setLoading)

       await populateItemList()
    },[])


    const populateItemList = async()=>{
        let array = []
        for(let i = 0 ; i < singleOrder?.cartItems?.length; i ++){
            const item = <div key={i}>
                <p>Name: {singleOrder?.cartItems[i]?.product?.name}</p>
                <p>Price: ${singleOrder?.cartItems[i]?.product?.price}</p>
                <p>Quantity: {singleOrder?.cartItems[i]?.quantity}</p>
                <p className={styles.line}></p>
            </div>
            array.push(item)
        }
        setItems(array)

    }

    return( <Layout title='Order details'>
        
        {loading?
        <ProgressIndicator/>:
        
        <section className={styles.single_order}>
            <article>
                <h1>Shipping Details</h1>
                <p>Date and time orderd: {singleOrder?.dateOrdered}</p>
                <p>Payment method: {singleOrder?.paymentMethod}</p>
                <p>Shipping cost: ${singleOrder?.shippingCost} </p>
                <p>Tax: ${singleOrder?.tax}</p>
                <p>Total item price: $ {singleOrder?.totalItemPrice}</p>
                <p>Total: ${singleOrder?.total}</p>
            </article>
            <article>
                <h2>Order Details</h2>
                <p>Name: {singleOrder?.shippingDetails?.name}</p>
                <p>Phone Contact: {singleOrder?.shippingDetails?.phoneContact}</p>
                <p>Address line: ${singleOrder?.shippingDetails?.addressLine} </p>
                <p>City: ${singleOrder?.shippingDetails?.city}</p>
                <p>Postal code: {singleOrder?.shippingDetails?.postalCode}</p>
                <p>Country: ${singleOrder?.shippingDetails?.country}</p>
            </article>
            <article>
                <h3>Items</h3>
                { items }
            </article>
            <div className={styles.btn} style={{marginBottom: '1em'}}>
                {state?.currentActivity === VIEWING_ORDER_HISTORY?
                <p>Thanks for your support</p>:
                <p>We'll call you shortly</p>
                }
            </div>
        </section>

        }
    </Layout>
    )
}

export default SingleOrder