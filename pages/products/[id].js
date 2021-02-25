import { getOneProduct, getProductsWithoutPaginaton} from '../../external_api/products/index'
import Layout from '../../components/layout/layout'
import styles from '../../styles/ProductDetails.module.scss'
import { useContext } from 'react'
import { Context } from '../../state/store/store'
import { ADD_ITEM_TO_CART,REMOVE_ITEM_FROM_CART, SET_NAVBAR_TITLE } from '../../state/actions'
import { useState } from 'react'
import { useEffect } from 'react'

const ProductDetails = ({product}) =>{

    const [state,dispatch] = useContext(Context)

    const [currentProduct, setCurrentProduct] = useState({})

    useEffect(()=>{

        dispatch({type: SET_NAVBAR_TITLE, payload: 'Product details'})

        //if the item is in the cart
        // probably the user has already changed the quantity
        //hence get it from the cart and set it as the current item
        // else it's new and it's quantity is 1 by default
        if(isProductInCart(product)){
            const foundItem = getItemInCart(product)
            setCurrentProduct({...foundItem})            
        }else{
            setCurrentProduct({...product, quantity: 1})
        }
    },[])

    const addOrRemoveFromCartHandler = event =>{
        
        event.preventDefault()

        if(!isProductInCart(currentProduct)){
            dispatch({type: ADD_ITEM_TO_CART, payload: currentProduct})
        }else{
             dispatch({type: REMOVE_ITEM_FROM_CART, payload: currentProduct})
             setCurrentProduct({...product, quantity: 1})
        }
    }

    const onIncrementButtonClickedHandler = event =>{  
        
        event.preventDefault()
        
        if(isProductInCart(currentProduct)){
            state.cart.forEach(e=>{
                if(e._id === currentProduct._id){
                    e.quantity ++
                    setCurrentProduct({...e})
                }
            })
        }else{
            setCurrentProduct({...currentProduct,quantity : currentProduct.quantity + 1})
        }
    }

    const onDecrementButtonClickedHandler = event =>{   

        event.preventDefault()
        
        if(isProductInCart(currentProduct)){
            state.cart.forEach(e=>{
                if(e._id === currentProduct._id){
                    if(!isQuantityLessThan2(e.quantity)){
                        e.quantity --
                        setCurrentProduct({...e})
                    }                   
                }
            })
        }else{
            if(!isQuantityLessThan2(currentProduct.quantity)){
                setCurrentProduct({...currentProduct,quantity : currentProduct.quantity - 1})
            }
        }
    }

    const isProductInCart = (product) =>{
        let found = false
        state.cart.forEach(element => {
            if(element._id === product._id){
                found = true
            }
        });
        return found;
    }

    const getItemInCart = (product) =>{
        let cartitem;

        state.cart.forEach(item => {
            if(item._id === product._id){
                cartitem = item
            }
        });
        return cartitem;
    }

    const isQuantityLessThan2 = (quantity) =>{
        return quantity < 2
    }

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
                                <div 
                                    className={styles.btn_minus}
                                    onClick={onDecrementButtonClickedHandler}
                                >-
                                </div>
                                <p>{currentProduct.quantity}</p>
                                <div  
                                    className={styles.btn_plus}
                                    onClick={ onIncrementButtonClickedHandler }
                                >+
                                </div>
                            </div>
                            <div 
                                className={styles.add_to_cart_btn}
                                onClick={addOrRemoveFromCartHandler}
                            >
                                { isProductInCart(currentProduct) ? 'Remove' : 'Add'}
                            </div>
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

