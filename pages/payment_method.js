import { useContext, useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import { Context } from "../state/store/store";
import braintree from 'braintree-web'
import { SET_NAVBAR_TITLE, SET_SINGLE_ORDER } from "../state/actions";
import { getShippingCost, getTax, sendPayPalOrder, sendStripeOrder } from "../external_api/orders";
import { PAY_PAL, STRIPE_PAYMENT, USER_TYPE_GUEST, USER_TYPE_RESGISTERED } from '../consts/index'
import { useRouter } from 'next/router'
import { CardElement, useStripe, useElements} from '@stripe/react-stripe-js'

const PaymentMethod = () =>{
    
    const [state, dispatch] = useContext(Context)

    const [error, setError] = useState('')

    const [btnDisabled, setButtonDisableProp ] = useState(false)
    
    const router = useRouter()

    const stripe = useStripe()

    const elements = useElements()
    
    useEffect(()=>{
        dispatch({type: SET_NAVBAR_TITLE, payload: 'Choose payment method'})
    },[])
    
    const { cart, ShippingDetails, userId } = state

    const getCostsAttached = async () =>{
      const tax = await getTax();
      const shippingCost = await getShippingCost();
      const total = cart.reduce((prev,item) => prev + item.price,0)
      const totalItemPrice = tax + shippingCost + total

      return { tax, shippingCost, total, totalItemPrice }
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
            
            const { tax, shippingCost, total, totalItemPrice} = await getCostsAttached()

            const payload = await paypalInstance.tokenize({
                flow:'checkout',
                amount: totalItemPrice,
                currency:'USD',
                displayName: 'NTrade'
            })
            
            const order = createOrderPayload(tax, shippingCost, total, totalItemPrice, PAY_PAL)

            const { result, errorMsg} = await sendPayPalOrder( order, payload.nonce)

            if(errorMsg){
                setError(errorMsg)
                return setButtonDisableProp(false)
            }

            dispatch({type: SET_SINGLE_ORDER, payload: result})

            setButtonDisableProp(false)

            await router.push('/thank_you')

        }catch(error){
            console.error("Error", error)
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
        
        setButtonDisableProp(true)

        setError('')

    try{

       const {error, paymentMethod } = await stripe.createPaymentMethod({
           type: 'card',
           card: elements.getElement(CardElement)
       })

       if(!error){
        const { id } = paymentMethod;

        const { tax, shippingCost, total, totalItemPrice} = await getCostsAttached()
        
        const order = createOrderPayload(tax, shippingCost, total, totalItemPrice, STRIPE_PAYMENT)

        const { errorMsg, result} = await sendStripeOrder(id,order)

        if(errorMsg){
            setButtonDisableProp(false)
            return setError(errorMsg)
        }else{
            dispatch({type: SET_SINGLE_ORDER, payload: result})

            setButtonDisableProp(false)
    
            await router.push('/thank_you')
        }
        
       }else{
        setButtonDisableProp(false)
        return setError(error.message)
       }
    }catch(err){
        setButtonDisableProp(false)
        return setError(error.message)
    }
    }

    return <Layout title='Payment method'>
        <h1>Order summary</h1>
        {error}
        <button 
            onClick={onPayPalButtonClickedHandler}
            disabled={ btnDisabled}>Payment method
        </button>
        <form onSubmit={onStripeFormSubmittedHandler}>
            <CardElement/>
            <button type='submit' disabled={btnDisabled}>
                Pay
            </button>
        </form>
    </Layout>

}

export default PaymentMethod;