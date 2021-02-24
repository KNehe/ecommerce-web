import styles from '../../styles/ProductCard.module.scss'

const ProductCard = ({imageUrl,name,price,click})=>{
    return(
        <article className={styles.product_list_card} onClick={click}>
            <img src={imageUrl} alt='product image'/>
            <div className={styles.content}>
              <p>{name}</p>
              <p>{price}</p>
            </div>
          </article>
    )

}

export default ProductCard;