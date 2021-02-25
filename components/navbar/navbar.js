import { useContext } from 'react'
import { Context } from '../../state/store/store'
import styles from '../../styles/NavBar.module.scss'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

const NavBar = ()=>{
    const [state,_] = useContext(Context)

    return <nav 
                className={styles.navbar}
            >
                <p>{state.navBarTitle}</p>
                <div className={styles.cart_icon_group}>
                    <FontAwesomeIcon icon={faShoppingCart}/>
                    <p className={styles.cart_count}>{state.cart.length}</p>
                </div>
            </nav>
}

export default NavBar;