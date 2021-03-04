import { useContext, useEffect } from "react"
import Layout from "../components/layout/layout"
import { SET_NAVBAR_TITLE } from "../state/actions"
import { Context } from "../state/store/store"
import styles from '../styles/SingleOrder.module.scss'

const SingleOrder = () =>{
    const [state, dispatch] =  useContext(Context)

    const { singleOrder } = state

    useEffect(()=>{
        dispatch({type: SET_NAVBAR_TITLE, payload: `Order ${state.singleOrder._id}` })
    },[])

    let items = [];

    for(let i = 0 ; i < singleOrder.cartItems.length; i ++){
        const item = <div key={i}>
            <p>Name: {singleOrder.cartItems[i].product.name}</p>
            <p>Price: ${singleOrder.cartItems[i].product.price}</p>
            <p>Quantity: {singleOrder.cartItems[i].quantity}</p>
            <p className={styles.line}></p>
        </div>
        items.push(item)
    }

    return <Layout title='Order details'>

        <section className={styles.single_order}>
            <article>
                <h1>Shipping Details</h1>
                <p>Date and time orderd: {singleOrder.dateOrdered}</p>
                <p>Payment method: {singleOrder.paymentMethod}</p>
                <p>Shipping cost: ${singleOrder.shippingCost} </p>
                <p>Tax: ${singleOrder.tax}</p>
                <p>Total item price: $ {singleOrder.totalItemPrice}</p>
                <p>Total: ${singleOrder.total}</p>
            </article>
            <article>
                <h2>Order Details</h2>
                <p>Name: {singleOrder.shippingDetails.name}</p>
                <p>Phone Contact: {singleOrder.shippingDetails.phoneContact}</p>
                <p>Address line: ${singleOrder.shippingDetails.addressLine} </p>
                <p>City: ${singleOrder.shippingDetails.city}</p>
                <p>Postal code: {singleOrder.shippingDetails.postalCode}</p>
                <p>Country: ${singleOrder.shippingDetails.country}</p>
            </article>
            <article>
                <h3>Items</h3>
                { items }
            </article>
            <div className={styles.btn}>We'll call you shortly</div>
        </section>


    </Layout>
}

export default SingleOrder