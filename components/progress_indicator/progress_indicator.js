import styles from '../../styles/ProgressIndicator.module.scss'

const ProgressIndicator = ({min}) =>{
    return <div className={min ? styles.ProgressIndicatorMin: styles.ProgressIndicator }></div>
}

export default ProgressIndicator;