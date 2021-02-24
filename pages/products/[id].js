import { getOneProduct, getProductsWithoutPaginaton} from '../../external_api/products/index'
import Layout from '../../components/layout/layout'
import styles from '../../styles/ProductDetails.module.scss'

const ProductDetails = ({product}) =>{

    return (
        <Layout title='Product details'>
            <article className={styles.product_details}>
                <div className={styles.img}>
                    <img src={product.imageUrl} alt='Product Image'/>
                </div>
                <div className={styles.text_content}>
                    <div className={styles.name_price}>
                        <h1>{product.name}</h1>
                        <p>${product.price}</p>
                    </div>
                    <div className={styles.buttons}>
                        <div className={styles.line_above}></div>
                        <div className={styles.btn_group}>
                            <div className={styles.increment_btns}>
                                <div className={styles.btn_minus}>-</div>
                                <p>1</p>
                                <div  className={styles.btn_plus}>+</div>
                            </div>
                            <div className={styles.add_to_cart_btn}>Add</div>
                        </div>
                        <div className={styles.line_below}></div>
                    </div>
                    <div className={styles.details_section}>
                        <h2>Details</h2>
                        <p>{product.details}</p>
                    </div>
                    </div>
            </article>
        </Layout>
    )

}

export async function getStaticPaths(){

    const {data} = await getProductsWithoutPaginaton()
    
    const paths = data.products.map((prod )=> ({
       params: { id: prod._id}
    }))

 return { paths, fallback: false }

}

export async function getStaticProps({ params }){

    const {data, errorMessage} = await getOneProduct(params.id)
    const product = data.product

    return {
        props:{ product }
    }
}

export default ProductDetails;

