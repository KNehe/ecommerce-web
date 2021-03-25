import styles from '../../styles/BackDrop.module.scss'

const BackDrop = ({isVisible,clickHandler})=>{
return (
    <>
    {
        isVisible ? <div
                         className={styles.BackDrop}
                         onClick={clickHandler}>

                    </div> : ''
    }
    </>
)
}

export default BackDrop;