import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../../styles/CartItem.module.scss'

const CartItem = ({name,price,imageUrl,quantity}) =>{
    return  <article className={styles.item}>
                <img src={imageUrl} alt='Product image'/>
                <div className={styles.right}>
                    <h2>{name}</h2>
                    <p>$ {price}</p>
                    <div className={styles.btn_group}>
                        <div className={styles.btn_group_2}>
                            <div><FontAwesomeIcon icon={faMinus}/></div>
                            <p>{quantity}</p>
                            <div><FontAwesomeIcon icon={faPlus}/></div>                            
                        </div>
                        <div> Remove</div>
                    </div>
                </div>
            </article>

}

export default CartItem