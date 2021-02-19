import styles from '../../styles/ProductCard.module.scss'

const ProductCard = ()=>{
    return(
        <article className={styles.product_list_card}>
            <img src='images/sneakers.png' alt='product image'/>
            <div className={styles.content}>
              <p>Item name</p>
              <p>Item price</p>
            </div>
          </article>
    )

}

export default ProductCard;