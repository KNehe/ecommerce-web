import styles from '../../styles/NavBar.module.scss'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import Link  from 'next/link'
import { SET_NAVBAR_TITLE } from '../../state/actions'
import { useDispatch, useSelector } from 'react-redux'
import { ORDER, PRODUCT_DETAILS, SHOPPING_CART, STORE } from '../../consts/navbar_titles'


const NavBar = ()=>{

    const { cart,navBarTitle,name,isLoggedIn, singleOrder } = useSelector(state => state)

    const dispatch =  useDispatch()

    const onCartIconClickedHandler =  () =>{
        dispatch({type: SET_NAVBAR_TITLE, payload: 'Shopping cart'})  
    }

    return <nav 
                className={styles.navbar}
            >   
            <Link href='/'>
                <p style={{ wordBreak: navBarTitle == ORDER + " " +singleOrder?._id? 'break-all':'', cursor:'pointer'}}>
                    {navBarTitle}
                </p>
            </Link>

                <section className={styles.left_section}>

                    <ul className={styles.drop_down}>
                        <li>
                            {isLoggedIn? <p>{name} </p>: '' }
                            <ul>
                                <li>
                                    <Link href='/user-profile'>
                                        <a >Profile</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href='/order_history'>
                                        <a>Order history</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href='/'>
                                        <a>Product list</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href='/shopping_cart'>
                                        <a>Cart</a>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <Link href='/shopping_cart'>
                        {
                            navBarTitle === STORE ||
                            navBarTitle ===  SHOPPING_CART ||
                            navBarTitle === PRODUCT_DETAILS ?
                            <div 
                            className={styles.cart_icon_group} 
                            onClick={onCartIconClickedHandler} >
                            <FontAwesomeIcon icon={faShoppingCart}/>
                            <p className={styles.cart_count}>{cart.length}</p>
                        </div>: ''
                        }
                    </Link>
            
                </section>
    
            </nav>
}

export default NavBar;