import { useEffect, useRef, useState } from 'react'
import { getProducts, getProductsByCategory, getProductsByNameOrCategory} from '../external_api/products/index'
import Layout from '../components/layout/layout'
import styles from './../styles/Index.module.scss'
import { faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProductCard from '../components/product_card/product_card'
import { getCategories } from '../external_api/categories/index'
import Category from '../components/category/category'
import Pagination from '../components/pagination/pagination'
import ProgressIndicator from '../components/progress_indicator/progress_indicator'
import NoProductsFound from '../components/no_products_found/no_products_found'
import { useRouter } from 'next/router'
import { ADD_ITEM_TO_CART, SET_NAVBAR_TITLE } from '../state/actions'
import { useDispatch, useSelector } from 'react-redux'
import { STORE } from '../consts/navbar_titles'
import { getSavedCart } from '../external_api/cart/index'
import CategoryShimmer from '../components/shimmers/category'
import ProductCardShimmer from '../components/shimmers/productcard'


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

  const [ isLoadingProducts, setIsLoadingProducts] = useState(false)

  const router = useRouter();

  const [isLoadingNextPage , setIsLoadingNextPage] = useState(false);

  const dispatch = useDispatch()

  const [error, setError] = useState('')

  const state = useSelector(state => state)

  const [initLoad, setInitLoad] = useState(true)

  const [paginationOn,setPaginationOn] = useState(true)

  const searchInputRef = useRef(null)

  const categoryListRef = useRef(null)

  useEffect(async()=>{

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

    await getCart()
    
    setInitLoad(false)
  },[])
  
  const getCart = async () =>{
    const {userId, jwt } = state;
    const { cart} = await getSavedCart(userId,jwt)
    if(cart){
      cart.forEach(item=>{
        if(!isProductInCart(item.product)){
          dispatch({type: ADD_ITEM_TO_CART, payload: item.product})
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
    
    //turn off pagination
    //because data received from api doesn't include pagination details
    //only products are returned
    setPaginationOn(false)

    let products, error;

    if(index == 0){
      const {data, errorMessage} = await getProducts();
      products = data.products;
      error = errorMessage;
      setcurrentPageIndex(1)
      //turn on pagination
      //because all products are fetched 
      //and therefore initial pagination logic used on first page load can be applied
      setPaginationOn(true)
    }else{
      const {data, errorMessage} = await getProductsByCategory(apiData.categories[index].category);
      products = data.result;
      error = errorMessage;
    }
    
    if(!error){
       setApiData({...apiData,products})
    }else{
      setError(true)
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

  const onPageIndicatorClickedHandler = async(index,event)=>{
    
    event.preventDefault();
    
    setIsLoadingProducts(true)

    setcurrentPageIndex(index);

    const {data,errorMessage} = await getProducts(index,20)

    if(errorMessage){
      setError(errorMessage)
    }else{
      setApiData({  ...apiData, products: data.products,})
    }

    setIsLoadingProducts(false)

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

    const searchKey = searchInputRef?.current?.value;
    
    if(!searchKey) return

    setIsLoadingProducts(true);
    
    //turn off pagination
    //because data received from api doesn't include pagination details
    setPaginationOn(false)

    setCurrentCategoryIndex('')
    
    const { data, errorMessage} = await getProductsByNameOrCategory(searchKey);      
    
    if(!errorMessage){
      setApiData({...apiData,products:data})
   }else{
      setError(errorMessage)
   }
    setIsLoadingProducts(false);
  }
   
  const onProductListCardClickedHandler = async(event,id) =>{

    event.preventDefault();

    dispatch({type: SET_NAVBAR_TITLE, payload: 'Product details'})
    setIsLoadingNextPage(true)
    await router.push(`products/${id}`)    
  }

  const [chevronVisible,setChevronVisible] = useState({left:false,right:true})

  const onChevronLeftClickedHandler = () =>{
    categoryListRef.current.scrollLeft -= 30 
  }

  const onChevronRightClickedHandler = () =>{
   categoryListRef.current.scrollLeft += 30
   
  }

  const onCategoryListScrolledHandler = () =>{
    const div = categoryListRef.current 

    if((div.offsetWidth + div.scrollLeft) >= div.scrollWidth){
      setChevronVisible({left:true,right:false})
    }
    if(div.scrollLeft <= 0){
      setChevronVisible({left:false,right:true})
    }
  }
 
  return (
    <Layout title='Product list'>
      {error? 
        <div className={styles.error_message}>{error}</div>:
      <>
        { !isLoadingNextPage ?
          <section className={styles.main}>

            <section className={styles.search_field}>
              <form onSubmit={searchInputController}>
                <input 
                  type='text' 
                  name='search' 
                  id='search' 
                  placeholder='Search by product name or category'
                  ref={searchInputRef}
                />
                <div className={styles.search_icon_wrapper} onClick={searchInputController}>
                  <FontAwesomeIcon icon={faSearch} />
                </div>
              </form>
            </section>

          <section className={styles.title}>
            <h1>Get the best products</h1>
          </section>

          <section className={styles.category_group}>
            {chevronVisible.left? 
              <div className={styles.chevron} onClick={onChevronLeftClickedHandler}>
                <FontAwesomeIcon icon={faChevronLeft}/>
              </div>:
              ''
            }
            <section 
              className={styles.category_list} 
              ref={categoryListRef}
              onScroll={onCategoryListScrolledHandler}
            >
              {initLoad? <CategoryShimmer/>:catergoryList}
            </section>
            {chevronVisible.right? 
              <div className={styles.chevron} onClick={onChevronRightClickedHandler}>
                <FontAwesomeIcon icon={faChevronRight}/>
              </div>:
               ''
            }
          </section>
          
          { isLoadingProducts ?
            <ProgressIndicator/>:
            <>
              <section className={styles.product_list} style={{marginBottom:'1em'}}>
                {
                  initLoad ? <ProductCardShimmer/>:
                
                apiData.products.length === 0 ? 
                  <NoProductsFound/> : productList
                }
              </section>
              {paginationOn?
              <section className={styles.pagination_section}>
    
                { apiData.products.length === 0  || apiData.pages === 1 ?
                  '' : paginationIndicatorList
                }
              </section>:''
              }
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
