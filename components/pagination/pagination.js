import styles from '../../styles/Pagination.module.scss'

const Pagination = ({pageNumber, currentIndex, pageIndex,click}) =>{
 return <p 
            className={ currentIndex === pageIndex ?styles.pagination_active : styles.pagination}
            onClick={click}
        >
            {pageNumber}
        </p>
}

export default Pagination