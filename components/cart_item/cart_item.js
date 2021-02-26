import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../../styles/CartItem.module.scss'

const CartItem = ({ 
                    product,
                    onMinusIconClicked, onPlusIconClicked,
                    onRemoveBtnClicked
                }) =>{
    return  <article className={styles.item}>
                <img src={product.imageUrl} alt='Product image'/>
                <div className={styles.right}>
                    <h2>{product.name}</h2>
                    <p>$ {product.price}</p>
                    <div className={styles.btn_group}>
                        <div className={styles.btn_group_2}>
                            <div onClick={ (event)=>onMinusIconClicked(event,product) }><FontAwesomeIcon icon={faMinus}/></div>
                            <p>{product.quantity}</p>
                            <div onClick={ (event)=>onPlusIconClicked(event,product) }><FontAwesomeIcon icon={faPlus}/></div>                            
                        </div>
                        <div onClick={ (event)=>onRemoveBtnClicked(event,product) }> Remove</div>
                    </div>
                </div>
            </article>

}

export default CartItem