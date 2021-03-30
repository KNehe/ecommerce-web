import styles from '../../styles/Shimmer.module.scss'

const ProductCardShimmer = () =>{
    
    let divs = []

    for(let i = 0 ; i < 16; i++){
      const div = <div key={i} className={styles.product_shimmer}></div>
      divs.push(div)
    }

    return divs
}

export default ProductCardShimmer