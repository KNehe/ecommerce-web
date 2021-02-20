import styles from '../../styles/ProductCard.module.scss'

const ProductCard = ({imageUrl,name,price})=>{
    return(
        <article className={styles.product_list_card}>
            <img src={imageUrl} alt='product image'/>
            <div className={styles.content}>
              <p>{name}</p>
              <p>{price}</p>
            </div>
          </article>
    )

}

export default ProductCard;