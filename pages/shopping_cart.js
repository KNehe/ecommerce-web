import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BackDrop from '../components/backdrop/backdrop';
import CartItem from '../components/cart_item/cart_item';
import Layout from '../components/layout/layout'
import Modal from '../components/modal/modal';
import { REMOVE_ITEM_FROM_CART, SET_NAVBAR_TITLE } from '../state/actions';
import styles from '../styles/ShoppingCart.module.scss'
import {useRouter} from 'next/router'
import ProgressIndicator from '../components/progress_indicator/progress_indicator'
import { isJwtValid } from '../external_api/users';

const ShoppingCart  = () =>{

    const state = useSelector(state => state)

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch({type: SET_NAVBAR_TITLE, payload: 'Shopping Cart'})
    },[])

    const { cart } = {...state}

    const [isModalVisible,setModalVisibility] = useState(false)

    const router = useRouter()

    const [isProgressIndicatorVisible, setProgressIndicatorVisibility] = useState(false)

    const [modalMessage, setModalMessage] = useState('')

    const onMinusIconClickedHandler =(event, product) =>{
        
        event.preventDefault()

        cart.forEach(e=>{
            if(e._id === product._id){
                if( !(e.quantity < 2) ){
                    e.quantity --
                    dispatch({type: '', payload: ''})
                }
            }
        })

    }

    const onPlusIconClickedHandler = (event,product) =>{
        
       event.preventDefault()

        cart.forEach(e=>{
            if(e._id === product._id){
                e.quantity ++
                dispatch({type: '', payload: ''})
            }
        })
    }
    
    const onRemoveBtnClickedHandler =(event,product) =>{
        
        event.preventDefault();

        dispatch({type: REMOVE_ITEM_FROM_CART, payload: product})
    }

    const cartItems = cart.map(item=>
        <CartItem
            key={item._id}
            product={item}
            onMinusIconClicked={onMinusIconClickedHandler}
            onPlusIconClicked={onPlusIconClickedHandler}
            onRemoveBtnClicked={onRemoveBtnClickedHandler}
        />
    )

    const reducer = (accumulator, item) => {
        return accumulator + item.price;
      };
    
    const onBackDropClickedHandler = event =>{

        event.preventDefault()

        setModalVisibility(false)

        setProgressIndicatorVisibility(false)

    }

    const onCheckoutBtnClickedHandler = async event =>{

        event.preventDefault()

        setProgressIndicatorVisibility(true)
        setModalMessage('')

        const { isLoggedIn, jwt} = state

        if(!isLoggedIn){
            setProgressIndicatorVisibility(false)
            setModalVisibility(true)
        }else{
            const isValid = await isJwtValid(jwt)

            if(!isValid){
                setModalMessage('Login session expired')
                setProgressIndicatorVisibility(false)
                setModalVisibility(true) 
            }else{
                router.push('shipping_details')
            }
        }  
    }

    return (
        <Layout title='Shopping cart'>
            <BackDrop 
                isVisible={isModalVisible}
                clickHandler={onBackDropClickedHandler}
            />

            <Modal
                isVisible={isModalVisible}
            >
                <div className={styles.modal_content}>
                    <p>{modalMessage}</p>
                    <div className={styles.sign_in_btn}>Sign In</div>
                    <p>Or</p>
                    <div className={styles.sign_up_btn}>Continue as guest</div>
                </div>
            </Modal>

            <section className={styles.shopping_cart}>
                <Link href='/'>
                    <h1>Continue shopping</h1>
                </Link>
            
                <div className={styles.line}></div>
                {cartItems}  
                { cart.length != 0 ?
                    <div className={styles.checkout_btn_sec}>
                        <p>Sub total: 
                            <span className={styles.sub_total}>
                                $ {cart.reduce(reducer,0) }
                            </span>
                        </p>
                            <div onClick={onCheckoutBtnClickedHandler}> 
                            { !isProgressIndicatorVisible ?
                                <>
                                    <p>Checkout</p>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </>:
                                <ProgressIndicator min={true}/>
                                } 
                            </div>
                    </div>:
                    <div style={{display:'grid' ,placeItems:'center', marginTop:'25vh'}}>
                        No items in cart
                    </div>
                } 
               
            </section>
        </Layout>    
    )
}

export default ShoppingCart;