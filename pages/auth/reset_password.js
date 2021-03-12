import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import Layout from "../../components/layout/layout"
import { SET_NAVBAR_TITLE } from "../../state/actions"
import styles from '../../styles/Auth.module.scss'


const SignIn = ()=>{

    const dispatch = useDispatch()
    
    useEffect(()=>{
        dispatch({type:SET_NAVBAR_TITLE,payload: 'Reset password'})
    },[])

    return (
        <Layout title='Reset password'>

            <section className={styles.main}>
                <form>
                    <label for='newPassword'>New password</label>
                    <input type='password' id='newPassword'/>
                    <label for='oldPassword'>Old password</label>
                    <input type='password' id='oldPassword'/>
                    
                    <div className={styles.group1}>
                        <p>Reset password</p>
                        <button>
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </button>
                    </div>
                </form>
            </section>

        </Layout>
    )
}

export default SignIn