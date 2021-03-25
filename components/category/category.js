import styles from '../../styles/Category.module.scss'

const Category = ({category,click, elementIndex, currentIndex}) =>{
    return <article 
                className={elementIndex === currentIndex ? styles.category_active : styles.category}
                onClick={click}
            >
            {category}
            </article>
}

export default Category;