import { useContext } from 'react'
import styles from '../../styles/NavBar.module.scss'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import Link  from 'next/link'
import { SET_NAVBAR_TITLE } from '../../state/actions'
import { useDispatch, useSelector } from 'react-redux'


const NavBar = ()=>{

    const { cart,navBarTitle } = useSelector(state => state)

    const dispatch =  useDispatch()

    const onCartIconClickedHandler =  () =>{
        dispatch({type: SET_NAVBAR_TITLE, payload: 'Shopping cart'})  
    }

    return <nav 
                className={styles.navbar}
            >
                <p>{navBarTitle}</p>
                <Link href='/shopping_cart'>
                    <div 
                        className={styles.cart_icon_group} 
                        onClick={onCartIconClickedHandler} >
                        <FontAwesomeIcon icon={faShoppingCart}/>
                        <p className={styles.cart_count}>{cart.length}</p>
                    </div>
                </Link>
            </nav>
}

export default NavBar;