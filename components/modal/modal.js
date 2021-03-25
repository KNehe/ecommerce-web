import styles from '../../styles/Modal.module.scss'

const Modal = ({children,isVisible}) =>{
    return isVisible ? <div className={styles.Modal}>{children}
    </div>: ''
}

export default Modal