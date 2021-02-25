import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect } from 'react';
import CartItem from '../components/cart_item/cart_item';
import Layout from '../components/layout/layout'
import { SET_NAVBAR_TITLE } from '../state/actions';
import { Context } from '../state/store/store';
import styles from '../styles/ShoppingCart.module.scss'

const ShoppingCart  = () =>{

    const [state,dispatch] = useContext(Context)

    useEffect(()=>{
        dispatch({type: SET_NAVBAR_TITLE, payload: 'Shopping Cart'})
    },[])

    const { cart } = {...state}

    const cartItems = cart.map(item=>
        <CartItem
            key={item._id}
            name={item.name}
            imageUrl={item.imageUrl}
            quantity={item.quantity}
            price={item.price}
        />
    )

    return (
        <Layout title='Shopping cart'>
            <section className={styles.shopping_cart}>
                <h1>Continue shopping</h1>
                <div className={styles.line}></div>
                {cartItems}  
                <div className={styles.checkout_btn_sec}>
                    <p>Sub total: <span className={styles.sub_total}>$ 100</span></p>
                    <div>
                        <p>Checkout</p>
                         <FontAwesomeIcon icon={faArrowRight} /> 
                    </div>
                </div>            
            </section>
        </Layout>    
    )
}

export default ShoppingCart;