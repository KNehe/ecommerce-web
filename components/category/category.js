import styles from '../../styles/Category.module.scss'

const Category = ({category}) =>{
    return <article className={styles.category_active}>{category}</article>
}

export default Category;