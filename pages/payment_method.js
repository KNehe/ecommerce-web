import { useContext, useEffect, useRef, useState } from "react";
import Layout from "../components/layout/layout";
import { Context } from "../state/store/store";
import braintree from 'braintree-web'
import { SET_NAVBAR_TITLE } from "../state/actions";
import { getShippingCost, getTax, sendPayPalOrder } from "../external_api/orders";
import { PAY_PAL, USER_TYPE_GUEST, USER_TYPE_RESGISTERED } from '../consts/index'

const PaymentMethod = () =>{
    
    const [state, dispatch] = useContext(Context)

    const [error, setError] = useState('')

    const [btnDisabled, setButtonDisableProp ] = useState({
        paypal:false,
        stripe:false
    }) 
    
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

    const onPayPalButtonClickedHandler = async event =>{
        event.preventDefault()

        setButtonDisableProp({...btnDisabled,paypal:true})
        
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
            
            const order = {
                shippingDetails: ShippingDetails, 
                shippingCost: shippingCost.toString(),
                tax: tax.toString(),
                total: total.toString(),
                totalItemPrice: totalItemPrice.toString(),
                userId,
                paymentMethod: PAY_PAL,
                userType: userId != null ? USER_TYPE_RESGISTERED : USER_TYPE_GUEST,
                cartItems: cart
            }
            console.log(order)

            const { result, errorMsg} = await sendPayPalOrder(order, payload.nonce)

            if(errorMsg){
                setError(errorMsg)
                return setButtonDisableProp({...btnDisabled,paypal:false})
            }

            console.log(result)

            setButtonDisableProp({...btnDisabled,paypal:false})

        }catch(error){
            console.error("Error", error)
            if(error.code === 'PAYPAL_POPUP_CLOSED'){
                setError("Process cancelled")
                return setButtonDisableProp({...btnDisabled,paypal:false})
            }
            setError("An error occurred try again later")
            setButtonDisableProp({...btnDisabled,paypal:false})

        }

    }

    return <Layout title='Payment method'>
        {error}
        <button 
            onClick={onPayPalButtonClickedHandler}
            disabled={ btnDisabled.paypal }>Payment method</button>
    </Layout>

}

export default PaymentMethod;