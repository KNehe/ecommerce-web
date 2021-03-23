import styles from '../../styles/Shimmer.module.scss'

const CategoryShimmer = () =>{
    
    let divs = []

    for(let i = 0 ; i < 13; i++){
      const div = <div className={styles.category_shimmer}></div>
      divs.push(div)
    }

    return <div className={styles.main}>{divs}</div>
}

export default CategoryShimmer