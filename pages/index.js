import { useEffect, useState } from 'react'
import { getProducts, getProductsByCategory, getProductsByNameOrCategory} from '../external_api/products/index'
import Layout from '../components/layout/layout'
import styles from './../styles/Index.module.scss'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProductCard from '../components/product_card/product_card'
import { getCategories } from '../external_api/categories/index'
import Category from '../components/category/category'
import Pagination from '../components/pagination/pagination'
import ProgressIndicator from '../components/progress_indicator/progress_indicator'
import NoProductsFound from '../components/no_products_found/no_products_found'
import { useRouter } from 'next/router'
import { ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART, SET_NAVBAR_TITLE } from '../state/actions'
import { useDispatch, useSelector } from 'react-redux'
import { STORE } from '../consts/navbar_titles'
import { getSavedCart } from '../external_api/cart/index'


export default function Home({ productData:data,categoryData:categories,fetchProductError,fetchCategoryError}) {

  const [apiData, setApiData] = useState({
    products: [],
    categories: [],
    currentPage:'',
    pages:'',
    fetchProductError: '',
    fetchCategoryError: '',
  });

  const [ currentCategoryIndex , setCurrentCategoryIndex] = useState(0)

  const [ currentPageIndex , setcurrentPageIndex] = useState(1)

  const [ isLoadingProducts, setIsLoadingProducts] = useState(true)

  const router = useRouter();

  const [isLoadingNextPage , setIsLoadingNextPage] = useState(false);

  const dispatch = useDispatch()

  const [error, setError] = useState('')

  const state = useSelector(state => state)

  useEffect(()=>{

    dispatch({type: SET_NAVBAR_TITLE, payload: STORE})

    if(fetchProductError || fetchCategoryError){
       return setError(fetchCategoryError || fetchProductError)
    }

    setCurrentCategoryIndex(0)
    setApiData({
     products: data.products,
     categories: categories.categories,
     currentPage: data.currentPage,
     pages: data.pages,
     fetchProductError,
     fetchCategoryError
   }); 
    setIsLoadingProducts(false) 

    getCart()
  },[])
  
  const getCart = async () =>{
    const {userId, jwt } = state;
    const { cart} = await getSavedCart(userId,jwt)
    if(cart){
      cart.forEach(item=>{
        if(!isProductInCart(item)){
          dispatch({type: ADD_ITEM_TO_CART, payload: item})
        }
      })
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

  const productList = apiData.products.map(product=>

    <ProductCard
      key={product._id}
      imageUrl={product.imageUrl}
      name={product.name}
      price={product.price}
      click={(event) => onProductListCardClickedHandler(event, product._id)}
    />

  );

  const onCategoryClickedHandler = async(index,event) =>{

    event.preventDefault();

    setCurrentCategoryIndex(index)

    setIsLoadingProducts(true)

    let products, error;

    if(index == 0){
      const {data, errorMessage} = await getProducts();
      products = data.products;
      error = errorMessage;
    }else{
      const {data, errorMessage} = await getProductsByCategory(apiData.categories[index].category);
      products = data.result;
      error = errorMessage;
    }
    
    if(!error){
       setApiData({...apiData,products})
    }else{
      //TODO set error
    }

    setIsLoadingProducts(false)

  }  
  
  const catergoryList = apiData.categories.map((element,index)=>
      <Category
       key={element._id}
       category={element.category}
       elementIndex={index}
       currentIndex={currentCategoryIndex}
       click={(event) =>onCategoryClickedHandler(index,event)}
      />
  );

  const onPageIndicatorClickedHandler = (index,event)=>{
    
    event.preventDefault();

    setcurrentPageIndex(index);
  }

  let paginationIndicatorList = [];
  
  for(let i = 0; i<apiData.pages;i++){
    
    const pageIndicator = <Pagination 
     key={i+1}
     pageNumber={i + 1}
     currentIndex={currentPageIndex}
     pageIndex={i + 1}
     click={(event)=>onPageIndicatorClickedHandler(i+1,event)}/>

    paginationIndicatorList.push( pageIndicator)
  }

  const searchInputController = async (event) =>{

    event.preventDefault();

    setIsLoadingProducts(true);

    const searchKey = event.target.value.trim();

    let products, error;

    if(searchKey){
      const { data, errorMessage} = await getProductsByNameOrCategory(searchKey);
      products = data;
      error = errorMessage;      
    }else{
      const {data, errorMessage} = await getProducts();
      products = data.products;
      error = errorMessage;
    }

    if(!error){
      setApiData({...apiData,products})
   }else{
     //TODO set error
   }

    setIsLoadingProducts(false);
  }
   
  const onProductListCardClickedHandler = async(event,id) =>{

    event.preventDefault();

    dispatch({type: SET_NAVBAR_TITLE, payload: 'Product details'})
    setIsLoadingNextPage(true)
    await router.push(`products/${id}`)    
  }
 
  return (
    <Layout title='Product list'>
      {error? 
        <div className={styles.error_message}>{error}</div>:
      <>
        { !isLoadingNextPage ?
          <section className={styles.main}>

          <section className={styles.search_field}>
            <FontAwesomeIcon icon={faSearch}/>
            <input 
              type='text' 
              name='search' 
              id='search' 
              placeholder='Search by product name or category'
              onChange={searchInputController}
            />
          </section>

          <section className={styles.title}>
            <h1>Get the best products</h1>
          </section>

          <section className={styles.category_list}>
            {catergoryList}
          </section>
          
          { isLoadingProducts ?
            <ProgressIndicator/>:
            <>
              <section className={styles.product_list}>
                { apiData.products.length === 0 ? 
                  <NoProductsFound/> : productList
                }
              </section>

              <section className={styles.pagination_section}>
    
                { apiData.products.length === 0  || apiData.pages === 1 ?
                  '' : paginationIndicatorList
                }
              </section>
            </>

          }
          
        </section>
        : 
        <ProgressIndicator/>
        }
        </>
      }
    </Layout>
      
  )
}

export async  function getStaticProps (){
  let fetchProductError, fetchCategoryError;
  
  const [firstResult, secondResult]= await Promise.all([
     getProducts(1,20),
     getCategories()
  ]);

  const {data,errorMessage} = firstResult;

  const {categories,errorMsg} = secondResult;

  fetchProductError = errorMessage? errorMessage :null;

  fetchCategoryError = errorMsg? errorMsg: null;

  let productData = !data ? null : data

  let categoryData = !categories ? null : categories
  return{
    props:{productData,fetchProductError,fetchCategoryError,categoryData}
  }
}
