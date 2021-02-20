import { useEffect, useState } from 'react'
import { getProducts} from '../external_api/products/index'
import Layout from '../components/layout/layout'
import styles from './../styles/Index.module.scss'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProductCard from '../components/product_card/product_card'

export default function Home({data,error}) {

  const [apiData, setApiData] = useState({
    products: [],
    currentPage:'',
    pages:'',
    error
  })

  useEffect(()=>{
  
   setApiData({
     products: data.products,
     currentPage: data.currentPage,
     pages: data.pages,
     error: data.error
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
          <article className={styles.category_active}>all</article>
          <article className={styles.category}>Phones</article>
          <article className={styles.category}>Shoes</article>
          <article className={styles.category}>Down</article>
          <article className={styles.category}>Phones</article>
          <article className={styles.category}>Shoes</article>
          <article className={styles.category}>Down</article>
          <article className={styles.category}>Phones</article>
          <article className={styles.category}>Shoes</article>
          <article className={styles.category}>Down</article>
          <article className={styles.category}>Phones</article>
          <article className={styles.category}>Shoes</article>
          <article className={styles.category}>Down</article>
          <article className={styles.category}>Phones</article>
          <article className={styles.category}>Shoes</article>
          <article className={styles.category}>Down</article>
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
  let error;
  const {data,errorMessage} = await getProducts(1,20);
  error = errorMessage? errorMessage :null;

  return{
    props:{data,error}
  }
}
