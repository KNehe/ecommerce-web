import { useEffect, useState } from 'react'
import { getProducts} from '../external_api/products/index'
import Layout from '../components/layout/layout'
import styles from './../styles/Index.module.scss'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProductCard from '../components/product_card/product_card'
import { getCategories } from '../external_api/categories/index'
import Category from '../components/category/category'

export default function Home({data,categories,fetchProductError,fetchCategoryError}) {

  const [apiData, setApiData] = useState({
    products: [],
    categories: [],
    currentPage:'',
    pages:'',
    fetchProductError: '',
    fetchCategoryError: '',
  });

  useEffect(()=>{
    setApiData({
     products: data.products,
     categories: categories.categories,
     currentPage: data.currentPage,
     pages: data.pages,
     fetchProductError,
     fetchCategoryError
   });  
  },[])


  const productList = apiData.products.map(product=>

    <ProductCard
      key={product._id}
      imageUrl={product.imageUrl}
      name={product.name}
      price={product.price}
    />

    );
  
    const catergoryList = apiData.categories.map(el=>
      <Category
       key={el._id}
       category={el.category}
      />
      );
 
  return (
    <Layout title='Product list'>
      
      <section className={styles.main}>

        <section className={styles.search_field}>
          <FontAwesomeIcon icon={faSearch}/>
          <input type='text' name='search' id='search' placeholder='Search by product name or category'/>
        </section>

        <section className={styles.title}>
          <h1>Get the best products</h1>
        </section>

        <section className={styles.category_list}>
          {catergoryList}
        </section>

        <section className={styles.product_list}>
          {productList}
        </section>

        <section className={styles.pagination_section}>
          <p className={styles.pagination_active}>1</p>
          <p className={styles.pagination}>2</p>
          <p className={styles.pagination}>3</p>
        </section>

      </section>

    </Layout>
      
  )
}

export async  function getServerSideProps (context){
  let fetchProductError, fetchCategoryError;
  
  const [firstResult, secondResult]= await Promise.all([
     getProducts(1,20),
     getCategories()
  ]);

  const {data,errorMessage} = firstResult;

  const {categories,errorMsg} = secondResult;

  fetchProductError = errorMessage? errorMessage :null;

  fetchCategoryError = errorMsg? errorMsg: null;

  return{
    props:{data,fetchProductError,fetchCategoryError,categories}
  }
}
