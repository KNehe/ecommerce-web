import { useContext } from 'react'
import { Context } from '../../state/store/store'
import styles from '../../styles/NavBar.module.scss'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import Link  from 'next/link'
import { SET_NAVBAR_TITLE } from '../../state/actions'


const NavBar = ()=>{

    const [state, dispatch] = useContext(Context)

    const onCartIconClickedHandler =  () =>{
        dispatch({type: SET_NAVBAR_TITLE, payload: 'Shopping cart'})
        
    }

    return <nav 
                className={styles.navbar}
            >
                <p>{state.navBarTitle}</p>
                <Link href='/shopping_cart'>
                    <div 
                        className={styles.cart_icon_group} 
                        onClick={onCartIconClickedHandler} >
                        <FontAwesomeIcon icon={faShoppingCart}/>
                        <p className={styles.cart_count}>{state.cart.length}</p>
                    </div>
                </Link>
            </nav>
}

export default NavBar;