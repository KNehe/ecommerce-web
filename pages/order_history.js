import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/layout/layout'
import { ORDER_HISTORY } from '../consts/navbar_titles';
import { getOrderHistory } from '../external_api/orders';
import { SET_CURRENT_ACTIVITY, SET_NAVBAR_TITLE, SET_SINGLE_ORDER } from '../state/actions';
import ProgressIndicator from '../components/progress_indicator/progress_indicator'
import styles from '../styles/OrderHistory.module.scss'
import {useRouter} from 'next/router'
import { VIEWING_ORDER_HISTORY } from '../consts/activities'
import { isJwtValid } from '../external_api/users';
import SignInRequest from "../components/signin_request/signin_request";

const OrderHistory =() =>{
    
    const dispatch = useDispatch()

    const {userId,jwt,isLoggedIn} = useSelector(state=>state)

    const [isLoading,setLoading] = useState(true)

    const [error,setError] = useState('')
    
    const [orderList, setOrderList ] = useState([])

    const router = useRouter()

    const [jwtValid,setJwtValidity] = useState(false)


    useEffect(async()=>{
        dispatch({type: SET_NAVBAR_TITLE, payload: ORDER_HISTORY})

        const isValid = await isJwtValid(jwt) 

        setJwtValidity(isValid)
    
        router.prefetch('/auth/signin')
        
        router.prefetch('/single_order')

        await getHistory()
    },[])
    

    const getHistory = async () =>{
        const {errorMsg,result} = await getOrderHistory(userId,jwt)

        if(error){
            setError(errorMsg)
            return setLoading(false)
        }
        
        if(result){
            const orders = result.map(item=>
                <article 
                    key={item._id}
                    className={styles.order}
                    onClick={(event)=>viewSingleOrderHandler(event,item)}
                >
                    <p>Order on: {item.dateOrdered}</p>
                </article>
                
            )

            setOrderList(orders)
            
            setLoading(false)
        }else{  
            setLoading(false)
        }
    }

    const viewSingleOrderHandler = async (event,order) =>{

        event.preventDefault()
        
        setLoading(true)

        dispatch({type:SET_CURRENT_ACTIVITY,payload: VIEWING_ORDER_HISTORY})

        dispatch({type: SET_SINGLE_ORDER,payload:order})

        await router.push('/single_order')

    }

    const signinBtnHandler = async event =>{

        event.preventDefault()
        
        dispatch({type: SET_CURRENT_ACTIVITY,payload: VIEWING_ORDER_HISTORY})
    
        await router.push('/auth/signin')
    }


    return (
        <Layout title={ORDER_HISTORY}>
            {isLoading?
                <ProgressIndicator/>:
                
                <section className={styles.main}>
                    { !isLoggedIn || !jwtValid ?
                        <SignInRequest 
                            isLoggedIn={isLoggedIn} 
                            jwtValid={jwtValid} 
                            click={signinBtnHandler}
                       />:
                    
                    <>
                     {error?
                        <div className={styles.error_message}>
                            <p>{error}</p>
                        </div>:
                        orderList.length > 0 ? orderList :
                        <div className={styles.className}>
                            <p>No orders found</p>
                            <p>This could be because you haven't bought any items</p>
                            <p>Or you bought items as a guest</p>
                        </div>
                     }                    
                    </>
                      }
                  </section>
            
                }
        </Layout>
    )

}


export default OrderHistory;