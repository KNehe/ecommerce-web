import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import CartItem from '../components/cart_item/cart_item';
import Layout from '../components/layout/layout'
import { REMOVE_ITEM_FROM_CART, SET_NAVBAR_TITLE } from '../state/actions';
import { Context } from '../state/store/store';
import styles from '../styles/ShoppingCart.module.scss'

const ShoppingCart  = () =>{

    const [state,dispatch] = useContext(Context)

    useEffect(()=>{
        dispatch({type: SET_NAVBAR_TITLE, payload: 'Shopping Cart'})
    },[])

    const { cart } = {...state}

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

    return (
        <Layout title='Shopping cart'>
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
                        <Link href='/shipping_details'>
                            <div> 
                                <p>Checkout</p>
                                <FontAwesomeIcon icon={faArrowRight} /> 
                            </div>
                        </Link>
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