import { useContext, useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import { Context } from "../state/store/store";
import braintree from 'braintree-web'
import { SET_NAVBAR_TITLE, SET_SINGLE_ORDER } from "../state/actions";
import { getShippingCost, getTax, sendPayPalOrder, sendStripeOrder } from "../external_api/orders";
import { PAY_PAL, STRIPE_PAYMENT, USER_TYPE_GUEST, USER_TYPE_RESGISTERED } from '../consts/index'
import { useRouter } from 'next/router'
import { CardElement, useStripe, useElements} from '@stripe/react-stripe-js'
import styles from '../styles/PaymentMethod.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import ProgressIndicator from './../components/progress_indicator/progress_indicator'

const PaymentMethod = () =>{
    
    const [state, dispatch] = useContext(Context)

    const [error, setError] = useState('')

    const [btnDisabled, setButtonDisableProp ] = useState(false)
    
    const router = useRouter()

    const stripe = useStripe()

    const elements = useElements()

    const { cart, ShippingDetails, userId } = state
    
    useEffect( ()=>{
        if(cart.length === 0){
            return router.push('/')
        }
        dispatch({type: SET_NAVBAR_TITLE, payload: 'Choose payment method'})
        setCostsAttached()
    },[])
    
    const [ costs, setCosts ] = useState({ tax:'', shippingCost:'', total:'', totalItemPrice:'' })

    const [ isSendingOrder, setIsSendingOrder ] = useState(false)

    const setCostsAttached = async () =>{
      const tax = await getTax();
      const shippingCost = await getShippingCost();
      const totalItemPrice = cart.reduce((prev,item) => prev + item.price,0)
      const total = tax + shippingCost + totalItemPrice
    
      return setCosts( { tax, shippingCost, total, totalItemPrice })
    }

    const createOrderPayload = (tax, shippingCost, total, totalItemPrice,paymentMethod) =>{

        const transformedCart = cart.map(item=>{
            return {
                product: item,
                quantity: item.quantity
            }
        })

        const order = {
            shippingDetails: ShippingDetails, 
            shippingCost: shippingCost.toString(),
            tax: tax.toString(),
            total: total.toString(),
            totalItemPrice: totalItemPrice.toString(),
            userId,
            paymentMethod,
            userType: userId != null ? USER_TYPE_RESGISTERED : USER_TYPE_GUEST,
            dateOrdered: Date.now(),
            cartItems: transformedCart
        
        }
        
        return order
    }

    const onPayPalButtonClickedHandler = async event =>{
        event.preventDefault()

        setButtonDisableProp(true)

        setError('')
        
        try{

            const clientInstance = await braintree.client.create({
                authorization: 'sandbox_9qqht4sx_2c34stzd8dh7rzxb'
            })

            const paypalInstance = await braintree.paypal.create({
                client: clientInstance
            })
            
            const payload = await paypalInstance.tokenize({
                flow:'checkout',
                amount: costs.totalItemPrice,
                currency:'USD',
                displayName: 'NTrade'
            })
            
            const order = createOrderPayload(costs.tax, costs.shippingCost, costs.total, costs.totalItemPrice, PAY_PAL)
            
            setIsSendingOrder(true)

            const { result, errorMsg} = await sendPayPalOrder( order, payload.nonce)

            if(errorMsg){
                setError(errorMsg)
                setIsSendingOrder(false)
                return setButtonDisableProp(false)
            }

            dispatch({type: SET_SINGLE_ORDER, payload: result})

            setButtonDisableProp(false)

            await router.push('/thank_you')

        }catch(error){
            console.error("Error", error)
            setIsSendingOrder(true)
            if(error.code === 'PAYPAL_POPUP_CLOSED'){
                setError("Process cancelled")
                return setButtonDisableProp(false)
            }
            setError("An error occurred try again later")
            setButtonDisableProp(false)

        }

    }

    const onStripeFormSubmittedHandler = async event =>{
        event.preventDefault()
        setIsSendingOrder(true)

        setError('')

    try{

       const {error, paymentMethod } = await stripe.createPaymentMethod({
           type: 'card',
           card: elements.getElement(CardElement)
       })

       if(!error){
        const { id } = paymentMethod;
        
        const order = createOrderPayload(costs.tax, costs.shippingCost, costs.total, costs.totalItemPrice, STRIPE_PAYMENT)
        
        setIsSendingOrder(true)

        const { errorMsg, result} = await sendStripeOrder(id,order)

        if(errorMsg){
            setButtonDisableProp(false)
            setIsSendingOrder(false)
            return setError(errorMsg)
        }else{
            dispatch({type: SET_SINGLE_ORDER, payload: result})

            setButtonDisableProp(false)
    
            await router.push('/thank_you')
        }
        
       }else{
        setButtonDisableProp(false)
        setIsSendingOrder(false)
        return setError(error.message)
       }
    }catch(err){
        setButtonDisableProp(false)
        setIsSendingOrder(false)
        return setError(error.message)
    }
    }

    return <Layout title='Payment method'>
       <section className={styles.main}>
        <h1>Order summary</h1>
        <div className={styles.group}>
            <div className={styles.row}>
                <p>Items</p>
                <p>${costs.totalItemPrice}</p>
            </div>
            <div className={styles.row}>
                <p>Shipping</p>
                <p>${costs.shippingCost}</p>
            </div>
            <div className={styles.row}>
                <p>Tax</p>
                <p>${costs.tax}</p>
            </div>
            <div className={styles.row}>
                <p>Total</p>
                <p>${costs.total}</p>
            </div>
        </div>
        {
            isSendingOrder?           
            <div className={styles.progress_indicator_wrapper}>
                <ProgressIndicator/>
            </div>:
            <>
                <h2>Choose payment method</h2>

            <div className={styles.form_section}>
                <p className={styles.error_message}>
                    {error}
                </p>
                <button 
                    onClick={onPayPalButtonClickedHandler}
                    disabled={ btnDisabled}
                    className={styles.paypal_btn}>
                        <FontAwesomeIcon icon={faPaypal}/>
                        <span className={styles.txt_1}>Pay</span>Pal
                </button>
                <p className={styles.or}>Or</p>
                <form onSubmit={onStripeFormSubmittedHandler}>
                    <CardElement/>
                    <button type='submit' disabled={btnDisabled}  className={styles.stripe_btn}>
                    <FontAwesomeIcon icon={faCreditCard}/>  Credit or Debit card
                    </button>
                </form>
        </div>
            
            </>
        }
       
       </section>
    </Layout>

}

export default PaymentMethod;